
const Path=require("path");
const customUA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

module.exports=async (browser,fileName)=>{
    const sourceName=fileName&&Path.basename(fileName).replace(".js","");
    const source=require("./Registry").find(it=>{
        return it.name.replace(/ /g,"")===sourceName;
    });
    browser.newPage=(()=>{
        const newPage=browser.newPage.bind(browser);
        return async (url,options)=>{
            const webpage=await newPage();
            await webpage.setUserAgent(customUA);
            await webpage.setViewport({width:1080,height:1024});
            if(url) await webpage.goto(url,options);
            return webpage;
        }
    })();
    return {
        source,
    }
}
