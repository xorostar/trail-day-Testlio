import { Context } from "koa";

interface Issues {
    get: (context: Context) => Promise<void>;
  }

export default Issues;