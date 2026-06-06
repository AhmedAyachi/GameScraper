

const fetchFromCache=require("./FetchFromCache");
const scrapSources=require("./ScrapSources");
const sources=require("./Registry");
const terminalLink=require("terminal-link").default;
const simplifyString=require("../../Functions/simplifyString");
const Path=require("node:path");
const FileSystem=require("node:fs");
const {logger}=require("../../Scripts");


module.exports=(args)=>new Promise(async (resolve,reject)=>{
    const query=simplifyString(args[0]);
    const skipCache=args.some(it=>it==="--skip-cache");
    const cachePath=Path.resolve(__dirname,"./Cache");
    if(!FileSystem.existsSync(cachePath)) FileSystem.mkdirSync(cachePath);

    const results=(!skipCache)&&(await fetchFromCache(query,{cachePath}));
    if(results) resolve(results);
    else resolve(scrapSources(query,{
        withGUI:args.some(arg=>arg==="--gui"),
    }).then(data=>new Promise((resolve,reject)=>{
        if(data){
            FileSystem.writeFile(Path.join(cachePath,query+".json"),JSON.stringify({
                query,data,
                instant:Date.now(),
            }),(error)=>{
                if(error) reject(error);
                else resolve(data);
            });
        } else resolve(data);
    })));
}).then(data=>{
    if(data){
        const {game,offers,results}=data;
        if(game){
            console.log("Game details:");
            for(const key in game){
                if(key==="rating"){
                    const rating=parseFloat(game.rating);
                    const ratingTextColor=(()=>{
                        if(rating>16) return logger.green;
                        else if(rating<14) return logger.red;
                        else return logger.yellow;
                    })();
                    console.log(key+":",ratingTextColor(game.rating));
                } else {
                    console.log(key+":",logger.majorColor(game[key]));
                }
            }
        }
        if(Array.isArray(offers)&&offers.length){
            console.log("\nPrices according to",logger.majorColor("jeuxvideo.com")+":");
            console.table(offers,["vendor","platform","price"]);     
        }
        if(Array.isArray(results)&&results.length){
            console.log("\nLocal prices found:");
            console.table(results.map(it=>({
                ...it,
                sourceName:(()=>{
                    const {sourceName}=it;
                    const source=sources.find(it=>it.name===sourceName);
                    return terminalLink(source.name,source.url,{
                        fallback:(text)=>text,
                    });
                })(),
            })),["sourceName","title","price"]);
        } else console.log("No local offers found.");
    } else console.log("No data found.");
});