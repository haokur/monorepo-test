import { count } from '@mono/utils';

fetch('http://localhost:9090').then((res) => {
  console.log(res, count(4, 5), 'index.ts::7行');
});

console.log(count(6,6),"index.ts::7行");