

module.exports=(str="")=>{
    str=str.trim().toLowerCase();
    let simplified="";
    for(const char of str){
        switch(char){
            case "ö": simplified+="o";
                break;
            case "é":
            case "è": simplified+="e";
                break;
            case "ç": simplified+="c";
                break;
            case "à": simplified+="a";
                break;
            default: simplified+=char;
        }
    }
    return simplified;
}
