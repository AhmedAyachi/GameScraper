
const getScraperDetails=require("../getScraperDetails");

module.exports=async (browser,query)=>{
    const {source}=await getScraperDetails(__filename);
    const webpage=await browser.newPage(source.url);
    await webpage.locator("header input[class*=search]").fill(query);
    await webpage.locator("header button[type=submit]").click();
    await webpage.waitForNavigation({waitUntil:"domcontentloaded"});
    const gameElHandles=await webpage.$$("#products .item[class*=product]");
    const results=[];
    for(const elHandle of gameElHandles){
        const title=await elHandle.evaluate(it=>it.querySelector("*[class*=product-title] a").textContent);
        const priceText=await elHandle.evaluate(it=>{
            return it.querySelector("*[class*=product-price] .price").textContent;
        });
        results.push({
            title:title.trim(),
            price:priceText.trim(),
        });
    }
    return results;
}
