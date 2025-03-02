"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/**dev-server with nodemon.js */
var path_1 = __importDefault(require("path"));
var nodemon_1 = __importDefault(require("nodemon"));
function runDevServer(config) {
    var isRunning = false;
    (0, nodemon_1["default"])(config);
    nodemon_1["default"]
        .on('start', function () {
        !isRunning && console.log('========== ⭐️Nodemon watch has started⭐️ =========\n');
        isRunning = true;
    })
        .on('restart', function (files) {
        console.log("\n=======================================");
        console.log("restart due to:\n", files);
        console.log("=======================================\n");
    })
        .on('quit', function () {
        console.log('App has quit');
        process.exit();
    });
}
runDevServer({
    script: path_1["default"].join(__dirname, '../src/main.ts'),
    watch: ['src'],
    ignoreRoot: ['node_modules', '.git'],
    ignore: ['src/test-ignore.ts']
});
