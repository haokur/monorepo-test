import nativeModule from './dist/index.js';
console.log(nativeModule, 'test.ts::2行');

function testNativeLog(){
   nativeModule.log_message("render","hello");
   nativeModule.log_message("render","world");
   nativeModule.log_message("main","hello");
   nativeModule.log_message("main","rust");

   console.log("xxxxxxxxx")
   setInterval(()=>{
      console.log("定时器----")
   },5000)
}

testNativeLog()

function testNativeGetClipboardFilePaths(){
   console.time('testNativeGetClipboardFilePaths');
   let result = nativeModule.get_clipboard_file_paths();
   console.timeEnd('testNativeGetClipboardFilePaths');
   console.log(result);
}

// testNativeGetClipboardFilePaths()
//
// const sumResult = nativeModule.sum(1, 5);
// console.log(sumResult, 'test.ts::5行');
