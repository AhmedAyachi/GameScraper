
const sources=require("./Registry");
const puppeteer=require("puppeteer");
const {loading}=require("../../Scripts");
const Path=require("node:path");
const FileSystem=require("node:fs");
const isQueryMatch=require("../../Functions/isQueryMatch");
const simplifyString=require("../../Functions/simplifyString");
const scrapForDetails=require("./ScrapForDetails");


module.exports=async (query,options)=>{
    const {withGUI,cachePath}=options;
    let scrapedSourceCount=0;
    const browser=await puppeteer.launch({
        devtools:withGUI,
        headless:!withGUI,
        args:[
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage", // Prevents crashes in Docker/low-RAM envs
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",           // Skips hardware acceleration overhead
            "--no-first-run",
            "--no-zygote",
            "--single-process",      // Saves significant memory (use with caution)
            "--window-size=1920,1080",
        ],
    });
    const {gameTitle,offers}=await scrapForDetails(browser,query)||{};
    const allResults=[];
    for(const source of sources){
        loading(`Scraping sources ${scrapedSourceCount}/${sources.length}...`);
        try {
            const {name}=source;
            const scrapper=require(`./Sources/${name.trim().replace(/ /g,"")}`);
            const sourceResults=await scrapper(browser,query).catch(()=>scrapper(browser,query));
            sourceResults.forEach(result=>{
                result.sourceName=name;
            });
            allResults.push(...sourceResults);
        } catch(error){
            loading();
            if(withGUI) console.error(error);
            else console.error(`Error while scraping ${source.url}.`);
            loading(true);
        }
        scrapedSourceCount++;
    }
    if(!withGUI) await browser.close();
    loading();
    const results=[];
    const includeControllers=query.includes("manet");
    allResults.forEach(result=>{
        const title=simplifyString(result.title);
        if(
            isQueryMatch(title,query)&&
            !isExistingResult(result,results)&&
            (includeControllers||!title.includes("manet")
        )){
            results.push(result);
        }
    });
    if(results.length||offers?.length) return new Promise((resolve,reject)=>{
        results.forEach(result=>{
            result.price=result.price.replace(",000","");
        });
        results.sort((b,a)=>parseFloat(a.price)<parseFloat(b.price)?1:-1);
        const data={gameTitle,offers,results};        
        FileSystem.writeFile(Path.join(cachePath,query+".json"),JSON.stringify({
            query,data,
            instant:Date.now(),
        }),(error)=>{
            if(error) reject(error);
            else resolve(data);
        });
    });
    else return null;
}

const isExistingResult=(result,results)=>{
    const {title,price}=result;
    return results.some(it=>(
        simplifyString(it.title)===simplifyString(title)&&
        (it.price)===price
    ));
}
