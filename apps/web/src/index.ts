import { count } from '@mono/utils';

fetch('http://localhost:9090').then((res) => {
  console.log(res, count(4, 5), 'index.ts::7行');
});

console.log(1111222,"index.ts::7行");