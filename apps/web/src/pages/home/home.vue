<template>
    <div class="home">
        <button @click="getCurrentEnvVersion">获取环境版本</button>
        <button @click="openDevTools">打开控制台</button>
        <button @click="changeConnectStatus">同步连接状态</button>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

const getCurrentEnvVersion = async () => {
    let version = await $electron.request('getEnv');
    console.log(version, 'home.vue::11行');
};

const openDevTools = () => {
    $electron.emit('openDevTools');
};

const changeConnectStatus = () => {
    $electron.emit('changeConnectStatus', { status: 1 });
};

onMounted(() => {
    $electron.on('openDevTools', (...args) => {
        console.log(args, 'home.vue::20行');
    });
});
</script>
<style lang="scss" scoped></style>
