

const FileSystem=require("node:fs");
const Path=require("node:path");
const maxDuration=24*60*60*1000;//24 hours

module.exports=async (query,{cachePath})=>{
    const cacheEntries=FileSystem.readdirSync(cachePath,{withFileTypes:true});
    const targetCacheName=query+".json";
    let queryEntryPath;
    cacheEntries.forEach(entry=>{
        const {name}=entry;
        const path=Path.resolve(entry.parentPath,name);
        const stats=FileSystem.statSync(path);
        if((Date.now()-stats.mtimeMs)>=maxDuration) FileSystem.unlinkSync(path);
        else if((!queryEntryPath)&&(name.toLowerCase()===targetCacheName)) queryEntryPath=path;
    });
    if(queryEntryPath){
        const content=FileSystem.readFileSync(queryEntryPath,"utf-8");
        const {data}=JSON.parse(content);
        return data;
    } else return null;
}
