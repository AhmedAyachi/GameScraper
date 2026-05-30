#!/usr/bin/env node
"use strict";

const scrapQuery=require("./Scripts/ScrapQuery/ScrapQuery");


new Promise(async (_,reject)=>{
    process.on("unhandledRejection",reject);
    const args=process.argv.slice(2),firstArg=args[0];
    scrapQuery(args[0],{
        isTest:args.some(arg=>arg==="-t"),
    });
}).catch(error=>{
    if(error){
        console.error(error);
    }
    process.exit(1);
});
