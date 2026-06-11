
const {sleep, isQueryMatch}=require("../../../Functions");


module.exports=async (browser,url,query)=>{
    const webpage=await browser.newPage(url);
    await webpage.waitForSelector("article").catch(()=>null);
    const articleHandlers=await webpage.$$("article");
    const data=[];
    for(const articleHandler of articleHandlers){
        const title=await articleHandler.$eval(".card-title",(titleEl)=>{
            return titleEl.textContent;
        });
        if(isQueryMatch(title,query)){
            const priceText=await articleHandler.$eval("data",(dataEl)=>{
                return dataEl.textContent;
            });
            data.push({
                title,
                price:priceText,
            });
        }
    }
    return {webpage,data};
}
