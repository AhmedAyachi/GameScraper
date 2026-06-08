
const pkgjson=require("../../package.json");
const {logger}=require("../Scripts");

module.exports=async ()=>{
    logger.log(
        logger.brandColor(pkgjson.name.replace(/-/g,""))+
        " "+logger.majorColor("v"+pkgjson.version),
    );
}
