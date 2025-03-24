import { count } from '@mono/utils';

fetch('http://localhost:9090/env').then(async (res) => {
    let data = await res.json();
    console.log(data, count(4, 5), 'index.ts::7行');
});

console.log(count(6, 6), process.env.ENV_CONFIG, 'index.ts::7行');
$electron.test();
