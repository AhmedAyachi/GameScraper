

module.exports={
    red:(text)=>`\x1b[0;31m${text}\x1b[0m`,
    green:(text)=>`\x1b[0;32m${text}\x1b[0m`,
    blue:(text)=>`\x1b[0;34m${text}\x1b[0m`,
    cyan:(text)=>`\x1b[0;36m${text}\x1b[0m`,
    yellow:(text)=>`\x1b[0;33m${text}\x1b[0m`,
    purple:(text)=>`\x1b[0;35m${text}\x1b[0m`,
    brightCyan:(text)=>`\x1b[0;96m${text}\x1b[0m`,

    brandColor:function(text){ return this.red(text) },
    majorColor:function(text){ return this.purple(text) },
    okColor:function(text){ return this.green(text) },
    koColor:function(text){ return this.red(text) },
    
    logWithSuccess:function(text){
        process.stdout.write(`${this.okColor("✓")} ${text}\n`);
    },
    logWithFailure:function(text){
        process.stdout.write(`${this.koColor("✗")} ${text}\n`);
    },
    log:(text)=>{
        process.stdout.write(text+"\n");
    },
}
