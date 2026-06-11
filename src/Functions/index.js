

const sleep=(ms)=>new Promise(resolve=>{
    setTimeout(resolve,ms);
});

const isQueryMatch=(str="",query="")=>{
    str=simplifyString(str);
    const words=query.split(" ");
    return words.every(word=>str.includes(word));
}

const cleanString=(str="")=>{
    let cleaned="";
    for(const char of str){
        if("\u202f\u2009\u00a0\u200a\u205f".includes(char)) cleaned+=" ";
        else if(char.match(/^([\p{L}\p{N}]| )+$/ui)) cleaned+=char;
    }
    return cleaned.trim().replace(/  +/g," ");
}

const simplifyString=(str="")=>{
    str=cleanString(str).toLowerCase();
    let simplified="";
    for(const char of str){
        if("öō".includes(char)) simplified+="o";
        else if("éè".includes(char)) simplified+="e";
        else if("ç".includes(char)) simplified+="c";
        else if("à".includes(char)) simplified+="a";
        else simplified+=char;
    }
    return simplified;
}

module.exports={
    sleep,cleanString,
    isQueryMatch,
    simplifyString,
}
