
const getScraperDetails=require("../getScraperDetails");
const {scrapFbPage}=require("../SrcTypeScrapers");

module.exports=async (browser,query)=>{
    const {source}=await getScraperDetails(__filename);
    const {data}=await scrapFbPage(browser,source.url,query);
    return data;
}
