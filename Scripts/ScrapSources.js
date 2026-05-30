
const sources=require("../Registry");
const puppeteer=require("puppeteer");
const loading=require("./Loading");
const simplifyString=require("../Functions/simplifyString");


module.exports=async (query,options)=>{
    const {isTest}=options;
    query=simplifyString(query);
    loading("Scrapping sources...");
    const browser=await puppeteer.launch({devtools:isTest});
    let results=[];
    for(const source of sources){
        const {name}=source;
        const scrapper=require(`../Sources/${name.trim().replace(/ /g,"")}`);
        const sourceResults=await scrapper(browser,query);
        sourceResults.forEach(result=>{
            result.sourceName=name;
        });
        results.push(...sourceResults);
    }
    if(!isTest) await browser.close();
    loading();
    if(results.length){
        if(!query.includes("manet")){
            results=results.filter(it=>!simplifyString(it.title).includes("manet"));
        }
        results.sort((b,a)=>parseFloat(a.price)<parseFloat(b.price)?1:-1);
        console.table(results,["sourceName","title","price"]);
    } else {
        console.log("no results found");
    }
}
