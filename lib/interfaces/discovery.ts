import { Context } from "koa";

interface Discovery {
    get: (context: Context) => Promise<void>;
}

export default Discovery;