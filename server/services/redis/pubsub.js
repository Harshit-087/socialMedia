import Redis  from "ioredis"


const pub = new Redis();
const sub = new Redis();


export  {pub,sub}