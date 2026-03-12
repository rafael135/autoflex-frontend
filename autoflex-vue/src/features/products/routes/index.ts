import type { RouteRecordRaw } from "vue-router";

export const productsRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: () => import("../components/ProductsList/index.vue"),
  },
];