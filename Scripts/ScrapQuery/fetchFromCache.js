

const FileSystem=require("node:fs");
const Path=require("node:path");
const maxDuration=24*60*60*1000;

module.exports=async (query)=>{
    const cachePath=Path.resolve(__dirname,"./Cache");
    if(!FileSystem.existsSync(cachePath)) FileSystem.mkdirSync(cachePath);
    const cacheEntries=FileSystem.readdirSync(cachePath,{withFileTypes:true});
    const targetCacheName=query+".json";
    const queryEntry=cacheEntries.find(it=>it.name.toLowerCase()===targetCacheName);
    if(queryEntry){
        const entryPath=Path.resolve(queryEntry.parentPath,queryEntry.name);
        const content=FileSystem.readFileSync(entryPath,"utf-8");
        const {result,instant}=JSON.parse(content);
        if((Date.now()-instant)<maxDuration) return result;
        else{
            FileSystem.unlinkSync(entryPath);
            return null;
        }
    } else return null;
}
