
const getScraperDetails=require("../getScraperDetails");
const {scrapFbPage,scrapTayaraPage}=require("../SrcTypeScrapers");

module.exports=async (browser,query)=>{
    const {source}=await getScraperDetails(__filename);
    const [facebookUrl,tayaraUrl]=source.urls;
    const data=[];
    return scrapFbPage(browser,facebookUrl,query).then(it=>{
        data.push(...it.data);
    }).catch(()=>{}).then(()=>scrapTayaraPage(browser,tayaraUrl,query)).then(it=>{
        data.push(...it.data);
        return data;
    });
}
