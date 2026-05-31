
const logger=require("./Logger");

let interval;
module.exports=(message=!interval)=>{
    clearInterval(interval);
    if(message){
        const chars=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
        let i=0;
        interval=setInterval(()=>{
            process.stdout.write(`\r${logger.cyan(chars[i%chars.length])} ${typeof(message)==="string"?message:""}`);
            i++;
        },80);
    } else {
        interval=null;
        process.stdout.write("\x1b[1K\n");
    }
}
