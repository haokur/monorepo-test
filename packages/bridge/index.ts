import { INativeModule } from "./native-interface";

const nativeModule:INativeModule = require('./native/index.node');
console.log(nativeModule,"index.ts::4行");
export default nativeModule