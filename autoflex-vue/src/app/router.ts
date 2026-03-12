import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import { productsRoutes } from "../features/products";
import { rawMaterialsRoutes } from "../features/rawMaterials";
import { productionRoutes } from "../features/production";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        redirect: "/products",
      },
      {
        path: "products",
        children: productsRoutes,
      },
      {
        path: "rawMaterials",
        children: rawMaterialsRoutes,
      },
      {
        path: "production",
        children: productionRoutes,
      },
      {
        path: ":pathMatch(.*)*",
        component: () => import("../pages/NotFound/index.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../pages/NotFound/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;