import {
    appConfig,
    awsConfig,
    mailConfig,
    redisConfig,
} from "./app.config";
import { dbConfig } from "./db.config";

export default [
    appConfig,
    dbConfig,
    awsConfig,
    redisConfig,
    mailConfig
];