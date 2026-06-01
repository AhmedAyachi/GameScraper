
const scrapper=require("./Scrapper");
const {loading,logger}=require("../../Scripts/index");
const baseUrl="jeuxvideo.com";
const platforms=[
    {id:22,name:"ps5"},
    {id:20,name:"ps4"},
    {id:10,name:"pc"},
];

module.exports=async function scrapForDetails(browser,query,options){
    loading(`Checking ${baseUrl} for details...`);
    await scrapper(browser);
    const webpage=await browser.newPage(`https://www.${baseUrl}/`);
    await webpage.locator("button[class*=button-cookies]").click();
    return queryGame(webpage,query,options);
};

const queryGame=async (webpage,query,options)=>{
    const {platformId=platforms[0].id}=options||{};
    const url=new URL(`https://www.${baseUrl}/rechercher.php`);
    url.searchParams.set("m","9");
    url.searchParams.set("t",platformId);
    url.searchParams.set("q",query);
    await webpage.goto(url.toString(),{waitUntil:"domcontentloaded"});
    const gameCardHandle=await webpage.$("[class*=recherche] [class*=card]");
    if(gameCardHandle){
        const gameTitle=await gameCardHandle.evaluate(it=>{
            const titleEl=it.querySelector("[class*=title]");
            return titleEl.textContent.trim();
        });
        await gameCardHandle.click();
        await webpage.waitForNavigation({waitUntil:"domcontentloaded"});
        const gameDetailsHandle=await webpage.$("[class*=gameCharacteristicsMain]");
        const gameRating=await gameDetailsHandle.evaluate(it=>{
            const textEl=it.querySelector("[class*=gaugeText]");
            return textEl.textContent.trim();
        });
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
        return {
            offers,
            game:{
                title:gameTitle,
                rating:gameRating+"/20",
            },
        };
    } else {
        const nextPlatformIndex=platforms.findIndex(it=>it.id===platformId)+1;
        if(nextPlatformIndex<platforms.length){
            return queryGame(webpage,query,{
                ...options,
                platformId:platforms[nextPlatformIndex].id,
            });
        } else {
            loading();
            logger.logWithFailure(`No relevant data found on ${baseUrl}.`);
            return null;
        }
    }
}
