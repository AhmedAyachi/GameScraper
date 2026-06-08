
const Path=require("path");

module.exports=async (fileName)=>{
    const sourceName=fileName&&Path.basename(fileName).replace(".js","");
    const source=require("./Registry").find(it=>{
        return it.name.replace(/ /g,"")===sourceName;
    }); 
    return {
        source,
    }
}
