

module.exports={
    red:(text)=>`\x1b[0;31m${text}\x1b[0m`,
    green:(text)=>`\x1b[0;32m${text}\x1b[0m`,
    blue:(text)=>`\x1b[0;34m${text}\x1b[0m`,
    cyan:(text)=>`\x1b[0;36m${text}\x1b[0m`,
    yellow:(text)=>`\x1b[0;33m${text}\x1b[0m`,
    brightCyan:(text)=>`\x1b[0;96m${text}\x1b[0m`,
}
