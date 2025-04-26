import Home from "@/pages/home/home.vue";
import List from "@/pages/home/list.vue";
import { defineAsyncComponent } from "vue";

const DetailPage = defineAsyncComponent(() => import("@/pages/home/detail.vue"));
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/list",
    name: "PageList",
    component: List,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/detail",
    name: "PageDetail",
    component: DetailPage,
    meta: {
      keepAlive: false,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
