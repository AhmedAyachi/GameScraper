
const {sources,platforms}=require("./General");
const puppeteer=require("puppeteer");
const {loading,logger}=require("../../Scripts");
const {simplifyString,cleanString,isQueryMatch}=require("../../Functions");
const scrapForDetails=require("./scrapForDetails");
const customUA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";


module.exports=async (query,options)=>{
    const {withGUI}=options;
    let scrapedSourceCount=0;
    const browser=await puppeteer.launch({
        devtools:withGUI,
        headless:!withGUI,
        args:[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", //Prevents crashes in Docker/low-RAM envs
            "--disable-accelerated-2d-canvas",
            "--disable-gpu", //Skips hardware acceleration overhead
            "--no-first-run",
            "--no-zygote",
            "--single-process", //Saves significant memory (use with caution)
            "--window-size=1920,1080",
        ],
    });
    browser.newPage=(()=>{
        const newPage=browser.newPage.bind(browser);
        return async (url,options)=>{
            const webpage=await newPage();
            await webpage.setUserAgent(customUA);
            await webpage.setViewport({width:1080,height:1024});
            if(url) await webpage.goto(url,{
                waitUntil:"domcontentloaded",
                ...options,
            });
            return webpage;
        }
    })();
    const details=await scrapForDetails(browser,query);
    const allResults=[];
    for(const source of sources){
        loading(`Scraping sources ${scrapedSourceCount}/${sources.length}...`);
        try {
            const {name,type}=source;
            const scrapper=require(`./SrcScrapers/${name.trim().replace(/ /g,"")}`);
            const sourceResults=await scrapper(browser,query).catch(()=>scrapper(browser,query));
            sourceResults.forEach(result=>{
                result.sourceName=name;
            });
            allResults.push(...sourceResults);
        } catch(error){
            loading();
            if(withGUI) console.error(error);
            else logger.logWithFailure(`Error while scraping ${source.name}.`);
            loading(true);
        }
        scrapedSourceCount++;
    }
    if(!withGUI) await browser.close();
    loading();
    const results=[];
    const includeControllers=query.includes("manet");
    allResults.forEach(result=>{
        const {title}=result;
        if(
            isQueryMatch(title,query)&&
            !isExistingResult(result,results)&&
            (includeControllers||!simplifyString(title).includes("manet")
        )){
            results.push(result);
        }
    });
    if(results.length) return new Promise((resolve,reject)=>{
        results.forEach(result=>{
            result.title=simplifyTitle(result.title,query);
            result.price=simplifyPrice(result.price);
        });
        results.sort((b,a)=>parseFloat(a.price)<parseFloat(b.price)?1:-1);
        const data={...details,results};
        resolve(data);
    });
    else if(details) return details;
    else return null;
}

const isExistingResult=(result,results)=>{
    const {title,price}=result;
    return results.some(it=>(
        simplifyString(it.title)===simplifyString(title)&&
        (it.price)===price
    ));
}

const simplifyTitle=(title,query)=>{
    title=cleanString(title);
    const simplifiedTitle=simplifyString(title);
    const wordIndices=query.split(" ").map(it=>{
        return simplifiedTitle.match(new RegExp(it,"i"))?.index;
    });
    const maxIndex=Math.max(...wordIndices);
    return title.substring(0,maxIndex+40);
}

const simplifyPrice=(price)=>{
    price=simplifyString(price.replace(",000",""));
    const matches=price.match(/^([0-9]+ *)+/g);
    if(matches){
        const currency=price.match(/\D+$/g,"")?.[0].trim()||"";
        price=matches[0].replace(/\D/g,"")+" "+currency.toUpperCase();
    }
    return price;
}
