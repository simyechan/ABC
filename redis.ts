import { createClient } from "redis";

const redisCli = createClient({legacyMode: true});

redisCli.on('connect', () => {
  console.log('redis연결');
})
redisCli.on('err', err => {
  console.log(err);
})

export default redisCli;