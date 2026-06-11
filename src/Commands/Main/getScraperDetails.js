
const Path=require("path");
const {sources}=require("./General");

module.exports=async (fileName)=>{
    const sourceName=fileName&&Path.basename(fileName).replace(".js","");
    const source=sources.find(it=>{
        return it.name.replace(/ /g,"")===sourceName;
    }); 
    return {
        source,
    }
}
