
const scrapper=require("./Scrapper");

module.exports=async (browser,query)=>{
    const url="https://www.pricecharting.com/";
    await scrapper(browser);
    const webpage=await browser.newPage(url);
    await webpage.locator("form input[type*=search]").fill(query);
    await webpage.locator("form input[class*=search_button]").click();
}
