
const Path=require("path");

module.exports=async (browser,fileName)=>{
    const sourceName=fileName&&Path.basename(fileName).replace(".js","");
    const source=require("../Registry").find(it=>{
        return it.name.replace(/ /g,"")===sourceName;
    });
    browser.newPage=(()=>{
        const newPage=browser.newPage.bind(browser);
        return async (url,options)=>{
            const webpage=await newPage();
            await webpage.setViewport({width:1080,height:1024});
            if(url) await webpage.goto(url,options);
            return webpage;
        }
    })();
    return {
        source,
    }
}
