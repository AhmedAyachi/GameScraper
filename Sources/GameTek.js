
const scrapper=require("./Scrapper");
const simplifyString=require("../Functions/simplifyString");

module.exports=async (browser,query)=>{
    const {source}=await scrapper(browser,__filename);
    const webpage=await browser.newPage(source.url);
    await webpage.locator("header input[class*=search]").fill(query);
    await webpage.waitForSelector("*[class*=search__result]>*:first-child",{timeout:5000});
    const gameElHandles=await webpage.$$(".search-item");
    const results=[];
    for(const elHandle of gameElHandles){
        const title=await elHandle.evaluate(it=>it.querySelector(".product_name").textContent);
        if(simplifyString(title).includes(query)){
            const priceText=await elHandle.evaluate(it=>{
                return it.querySelector(".product_price").textContent;
            });
            results.push({
                title:title,
                price:(it=>it.replace(",000",""))(priceText.trim()),
            });
        }
    }
    return results;
}
