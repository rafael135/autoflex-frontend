import type { RouteRecordRaw } from "vue-router";

export const productionRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import("../components/ProductionView/index.vue"),
  },
];