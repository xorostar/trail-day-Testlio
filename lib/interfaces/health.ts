import { Context } from "koa";

interface Health {
    get: (context: Context) => Promise<void>;
}

export default Health;