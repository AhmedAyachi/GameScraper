
const scrapper=require("./Scrapper");
const {loading,logger}=require("../../Scripts/index");
const baseUrl="jeuxvideo.com";

module.exports=(browser,query)=>new Promise(async (resolve)=>{
    loading(`Checking ${baseUrl} for details...`);
    const url=new URL(`https://www.${baseUrl}/rechercher.php`);
    url.searchParams.set("m","9");
    url.searchParams.set("t","22");//10
    url.searchParams.set("q",query);
    await scrapper(browser);
    const webpage=await browser.newPage(url.toString());
    await webpage.locator("button[class*=button-cookies]").click();
    const gameCardHandle=await webpage.$("[class*=recherche] [class*=card]");
    if(gameCardHandle){
        const gameTitle=await gameCardHandle.evaluate(it=>{
            const titleEl=it.querySelector("[class*=title]");
            return titleEl.textContent.trim();
        });
        await gameCardHandle.click();
        await webpage.waitForNavigation({waitUntil:"domcontentloaded"});
        const offerHandles=await webpage.$$("[class*=gameAffiliate__table]>a");
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
        loading();
        logger.logWithSuccess(`Checking ${baseUrl} for details.`);
        resolve({gameTitle,offers});
    } else {
        loading();
        logger.logWithFailure(`No relevant data found on ${baseUrl}.`);
        resolve();
    }
});
