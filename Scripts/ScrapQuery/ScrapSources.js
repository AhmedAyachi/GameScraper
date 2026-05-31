
const sources=require("../../Registry");
const puppeteer=require("puppeteer");
const loading=require("../Loading");
const FileSystem=require("node:fs");
const isQueryMatch=require("../../Functions/isQueryMatch");
const simplifyString=require("../../Functions/simplifyString");
const scrapActualPrice=require("../scrapActualPrice");
const Path=require("node:path");


module.exports=async (query,options)=>{
    const {isTest}=options;
    query=simplifyString(query);
    loading("Scrapping sources...");
    const browser=await puppeteer.launch({devtools:isTest});
    await scrapActualPrice(browser,query);
    const allResults=[];
    for(const source of sources){
        try {
            const {name}=source;
            const scrapper=require(`../../Sources/${name.trim().replace(/ /g,"")}`);
            const sourceResults=await scrapper(browser,query);
            sourceResults.forEach(result=>{
                result.sourceName=name;
            });
            allResults.push(...sourceResults);
        } catch(error){
            loading();
            if(isTest){
                console.error(error);
            } else {
                console.error(`Error while scraping ${source.url}.`);
            }
            loading(true);
        }
    }
    if(!isTest) await browser.close();
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
    if(results.length) return new Promise((resolve,reject)=>{
        results.forEach(result=>{
            result.price=result.price.replace(",000","");
        });
        results.sort((b,a)=>parseFloat(a.price)<parseFloat(b.price)?1:-1);
        FileSystem.writeFile(Path.resolve(__dirname,"./Cache",query+".json"),JSON.stringify({
            query,
            instant:Date.now(),
            result:results,
        }),(error)=>{
            if(error) reject(error);
            else resolve(results);
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
