import nativeModule from './dist/index.js';
console.log(nativeModule, 'test.ts::2行');

const sumResult = nativeModule.sum(1, 5);
console.log(sumResult, 'test.ts::5行');
