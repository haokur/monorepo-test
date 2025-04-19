import nativeModule from './dist/index.js';
console.log(nativeModule, 'test.ts::2行');

nativeModule.log_message("hello");
nativeModule.log_message("world");
nativeModule.log_message("hello");
nativeModule.log_message("rust");

console.log("xxxxxxxxx")
setInterval(()=>{
   console.log("定时器----")
},5000)

const sumResult = nativeModule.sum(1, 5);
console.log(sumResult, 'test.ts::5行');
