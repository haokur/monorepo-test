<template>
    <div class="App">
        <router-view v-slot="{ Component, route }">
            <keep-alive max="3">
                <component v-if="route.meta.keepAlive" :is="Component" />
            </keep-alive>
            <component v-if="!route.meta.keepAlive" :is="Component" />
        </router-view>
    </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped></style>
