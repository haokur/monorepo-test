import path from 'path';

import Koa from 'koa';
import KoaStatic from 'koa-static';
import cors from '@koa/cors';
import KoaRoute from '@koa/router';
import { count } from '@mono/utils';

import nativeModule from '@mono/bridge';
import { getEnv } from './utils/common.util';

const app = new Koa();
const router = new KoaRoute();

// 配置 CORS 允许跨域请求
app.use(
    cors({
        origin: '*', // 允许所有域名访问，建议根据需要配置为特定的域名
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true, // 如果需要允许携带凭据（如 Cookie），则设置为 true
        secureContext: false,
    })
);

app.use(KoaStatic(path.resolve(__dirname, '../assets')));

router.get('/', async (ctx) => {
    console.log(nativeModule, 'main.ts::28116688行');
    const helloResult = nativeModule.hello();
    console.log(helloResult, 'main.ts::29行');
    const result = count(4, 5);
    ctx.body = 'hello main22223445' + 'count result is ' + result;
});
router.get('/env', async (ctx) => {
    ctx.body = { message: 'current env is ' + getEnv() };
});
router.get('/video', async (ctx) => {
    ctx.body = 'hello video';
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(9090, () => {
    console.log('server run http://localhost:9090');
});
