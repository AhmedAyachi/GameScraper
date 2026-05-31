

const fetchFromCache=require("./FetchFromCache");
const scrapSources=require("./ScrapSources");
const sources=require("./Registry");
const terminalLink=require("terminal-link").default;
const simplifyString=require("../../Functions/simplifyString");

module.exports=(args)=>new Promise(async (resolve,reject)=>{
    const query=simplifyString(args[0]);
    const skipCache=args.some(it=>it==="--skip-cache");
    const results=(!skipCache)&&(await fetchFromCache(query));
    if(results) resolve(results);
    else resolve(scrapSources(query,{
        isTest:args.some(arg=>arg==="-t"),
    }));
}).then(results=>{
    if(Array.isArray(results)&&results.length) console.table(results.map(it=>({
        ...it,
        sourceName:(()=>{
            const {sourceName}=it;
            const source=sources.find(it=>it.name===sourceName);
            return terminalLink(source.name,source.url,{
                fallback:(text)=>text,
            });
        })(),
    })),["sourceName","title","price"]);
    else {
        console.log("No results found.");
    }
});