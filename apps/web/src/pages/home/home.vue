<template>
    <div class="home">
        <button @click="getCurrentEnvVersion">获取环境版本</button>
        <button @click="openDevTools">打开控制台</button>
        <button @click="changeConnectStatus">同步连接状态</button>
        <button @click="stopListenConnectStatus">解除监听</button>
        <button @click="loggerMessage">打印日志</button>
    </div>
</template>
<script lang="ts" setup>
import { useElectronEvent } from '@/hooks/useElectronEvent';
import { getTagLogger } from '@/utils/common';
import { ref } from 'vue';
const logger = getTagLogger('HOME');
const loggerOther = getTagLogger('Other');

const getCurrentEnvVersion = async () => {
    let version = await $electron.request('getEnv');
    console.log(version, 'home.vue::11行');
};

const openDevTools = () => {
    console.log('打开控制台', 'home.vue::19行');
    $electron.request('openDevTools', '主窗口');
};

const changeConnectStatus = () => {
    $electron.broadcast('changeConnectStatus', { status: 1 });
};

const [stopListenConnectStatus] = useElectronEvent('changeConnectStatus', (ev) => {
    console.log('listen changeConnectStatus', ev);
});

const loggerMessage = () => {
    logger.info('hello world', 'nice boy', { a: 111 });
    loggerOther.info('good other');
};
</script>
<style lang="scss" scoped></style>
