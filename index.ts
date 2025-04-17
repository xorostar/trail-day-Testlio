import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import config from './config';
import router from './lib/routes';
import { connect } from './lib/models/connection';
const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port, async () => {
    console.log(`Listening on http://localhost:${config.port}`); 

    // Connect to the database
    await connect();
}); 