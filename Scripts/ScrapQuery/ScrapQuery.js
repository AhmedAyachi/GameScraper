

const fetchFromCache=require("./fetchFromCache");
const scrapSources=require("./ScrapSources");
const sources=require("../../Registry");
const terminalLink=require("terminal-link").default;

module.exports=(query,options)=>new Promise(async (resolve,reject)=>{
    const results=await fetchFromCache(query);
    if(results) resolve(results);
    else resolve(scrapSources(query,options));
}).then(results=>{
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
});