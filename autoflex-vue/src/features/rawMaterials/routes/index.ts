import type { RouteRecordRaw } from "vue-router";

export const rawMaterialsRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import("../components/RawMaterialsList/index.vue"),
  },
];