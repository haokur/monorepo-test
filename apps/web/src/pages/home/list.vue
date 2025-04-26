<template>
    <div class="list">
        <button @click="openDevTools">打开控制台</button>
        <button @click="stopListenConnectChange">取消订阅连接状态</button>
        <button @click="startWatch('num')">开始监听-数字</button>
        <button @click="startWatch('code')">开始监听-字母</button>
        <button @click="jumpDetailPage">跳转详情页</button>
    </div>
</template>
<script lang="ts" setup>
import { useElectronEvent } from '@/hooks/useElectronEvent';
import { useEmitEventManager } from '@/hooks/useEmitStopManager';
import { useRouter } from 'vue-router';
const router = useRouter();

const { emit } = useEmitEventManager();

const openDevTools = () => {
    $electron.request('openDevTools', 'mini窗列表页');
};

const handleWatchEvents = (data: any) => {
    console.log(data, 'list.vue::17行');
};

const [stopListenConnectChange] = useElectronEvent('changeConnectStatus', (ev) => {
    console.log(`接收到状态变化`, ev);
});

const jumpDetailPage = () => {
    router.push({
        path: '/detail',
    });
};

const startWatch = (type: string) => {
    emit('watchEvents', type, handleWatchEvents);
};
</script>
<style lang="scss" scoped></style>
