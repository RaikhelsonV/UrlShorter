import {createClient} from "redis";

let redisClient = createClient({url: process.env.REDIS_URL});

redisClient.connect().catch(console.error);

export default redisClient;