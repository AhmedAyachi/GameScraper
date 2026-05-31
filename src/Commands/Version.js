
const pkgjson=require("../../package.json");

module.exports=async ()=>{
    console.log(pkgjson.name.replace(/-/g,""),"v"+pkgjson.version);
}
