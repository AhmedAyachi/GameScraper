
const scrapper=require("./Scrapper");

module.exports=(browser,query)=>new Promise(async (resolve)=>{
    const url=new URL("https://www.jeuxvideo.com/rechercher.php");
    url.searchParams.set("m","9");
    url.searchParams.set("q",query);
    await scrapper(browser);
    const webpage=await browser.newPage(url.toString());
    await webpage.locator("button[class*=button-cookies]").click();
    await webpage.locator("[class*=recherche] [class*=card]").click();
    await webpage.waitForNavigation({waitUntil:"domcontentloaded"});
    const offerHandles=await webpage.$$("*[class*=gameAffiliate__table]>a");
    const offers=[];
    for(const handle of offerHandles){
        const [vendor,platform,price]=await handle.evaluate(it=>{
            const tds=[...it.querySelectorAll("[class*=gameAffiliate__td]")];
            return tds.map(td=>td.textContent.trim());
        });
        if(!offers.some(it=>it.platform===platform)){
            offers.push({vendor,platform,price});
        }
    }
    resolve(offers);
});
