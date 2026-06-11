

const seeMoreContainerClasses=["__fb-light-mode","x1n2onr6","xzkaem6"];
const postContainerClasses=["x9f619","x1n2onr6","x1ja2u2z","xeuugli","x19h7ccj"];
const postBodyContainerClasses=["html-div","xdj266r","x14z9mp","xat24cr","x1lziwak"];
const minPostCount=20,maxReattemptCount=2;
const {sleep,isQueryMatch}=require("../../../Functions");

module.exports=async (browser,url,query)=>{
    const webpage=await browser.newPage(url,{waitUntil:"load"});
    await webpage.locator("[aria-label=Close]").click().catch(()=>{});
    const postContainerHandler=await webpage.$(`${postContainerClasses.map(it=>`[class~="${it}"]`).join("")}>*:not([class])`);
    const postHandlers=await fetchPostHandlers(webpage,postContainerHandler);
    const postBodies=[];
    for(const handler of postHandlers){
        const postBody=await getPostBody(handler);
        if(postBody) postBodies.push(postBody);
    }
    const data=getPostBodiesData(query,postBodies);
    return {webpage,data};
}

const fetchPostHandlers=async (webpage,postContainerHandler,{postCount=0,reattemptCount=0}={})=>{
    await sleep(3000);
    await webpage.$eval(`${seeMoreContainerClasses.map(it=>`[class~="${it}"]`).join("")}`,(seeMoreEl=>{
        seeMoreEl.remove();
    })).catch(()=>{});
    await postContainerHandler.$eval(":scope>*:last-child",(element)=>{
        element.scrollIntoView({
            behavior:"smooth",
            block:"end",
        });
    });
    const postHandlers=await postContainerHandler.$$(`:scope>div:not([class])`);
    const currentPostCount=postHandlers.length;
    if((reattemptCount<maxReattemptCount)&&(currentPostCount<minPostCount)){
        if(currentPostCount===postCount) reattemptCount++;
        else{
            postCount=currentPostCount;
            reattemptCount=0;
        }
        return fetchPostHandlers(webpage,postContainerHandler,{reattemptCount,postCount});
    }
    else return postHandlers;
}

const getPostBody=async (handler)=>{
    const bodyHandler=await handler.$(`${postBodyContainerClasses.map(it=>`[class~="${it}"]`).join("")}`);
    if(bodyHandler){
        const morebtnHandler=await bodyHandler.$(`::-p-text(See more)`);
        if(morebtnHandler) await morebtnHandler.click();
        const body=await bodyHandler.evaluate(element=>{
            return element.textContent;
        }).catch(()=>"");
        return body;
    } else return "";
}

const getPostBodiesData=(query,postBodies)=>{
    const data=[];
    for(const body of postBodies){
        if(isQueryMatch(body,query)){
            data.push({
                title:getTitleFromText(query,body),
                price:getPriceFromText(query,body),
            });
        }
    }
    return data;
}

const getTitleFromText=(query,text)=>{
    return query;
}

const getPriceFromText=(query,text="")=>{
    return text.substring(text.indexOf(query)).match(/pri(\D)*[0-9]+(\D)*( |\n)+/gi)?.[0].match(/\d+[a-z]+[ |\n]+/gi)?.[0];
}
