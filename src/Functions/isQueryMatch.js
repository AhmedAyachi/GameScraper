

const simplifyString=require("./simplifyString");

module.exports=(str="",query="")=>{
    str=simplifyString(str);
    const words=query.split(" ");
    return words.every(word=>str.includes(word));
}
