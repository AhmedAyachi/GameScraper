
const FileSystem=require("node:fs");
const Path=require("node:path");
const maxDuration=24*60*60*1000;//24 hours
const cachePath=Path.resolve(".gamescraper");

module.exports={
    get:async (query)=>{
        if(!FileSystem.existsSync(cachePath)) FileSystem.mkdirSync(cachePath);
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
    },
    set:async (query,data)=>new Promise((resolve,reject)=>{
        if(!FileSystem.existsSync(cachePath)) FileSystem.mkdirSync(cachePath);
        FileSystem.writeFile(Path.join(cachePath,query+".json"),JSON.stringify({
            query,data,
            instant:Date.now(),
        }),(error)=>{
            if(error) reject(error);
            else resolve(data);
        });
    }),
}
