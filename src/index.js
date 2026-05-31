#!/usr/bin/env node
"use strict";


const commands=require("./Commands/index");


new Promise((resolve,reject)=>{
    process.on("unhandledRejection",reject);
    const args=process.argv.slice(2),firstArg=args[0];
    const cmdName=args[0];
    switch(cmdName){
        case "-v":
        case "--version":
            resolve(commands.version());
        break;
        default:
            const command=commands[cmdName]||commands.scrapQuery;
            resolve(command(args));
        break;
    }
    
}).catch(error=>{
    if(error){
        console.error(error);
    }
    process.exit(1);
});
