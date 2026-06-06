

module.exports=(str="")=>{
    str=str.trim().toLowerCase();
    let simplified="";
    for(const char of str){
        if("öō".includes(char)) simplified+="o";
        else if("éè".includes(char)) simplified+="e";
        else if("ç".includes(char)) simplified+="c";
        else if("à".includes(char)) simplified+="a";
        else if("\u202f\u2009\u00a0\u200a\u205f".includes(char)) simplified+=" ";
        else simplified+=char;
    }
    return simplified;
}
