
const getScraperDetails=require("../getScraperDetails");

module.exports=async (browser,query)=>{
    const {source}=await getScraperDetails(__filename);
    const webpage=await browser.newPage(source.url);
    await webpage.locator("#search_widget input").fill(query);
    await webpage.locator("#search_widget button[type=submit]").click();
    await webpage.waitForNavigation({waitUntil:"domcontentloaded"});
    const gameElHandles=await webpage.$$("section#products .js-product.product");
    const results=[];
    for(const elHandle of gameElHandles){
        const title=await elHandle.evaluate(it=>it.querySelector(".name a").textContent);
        const priceText=await elHandle.evaluate(it=>it.querySelector(".price").textContent);
        results.push({
            title:title.replace(/ \-\.\.\.|\.\.\./gi,""),
            price:(it=>it.substring(0,it.indexOf("\n")))(priceText.trim()),
        });
    }
    return results;
}
