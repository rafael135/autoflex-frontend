import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ProductsRoutes } from "../features/products";
import { RawMaterialsRoutes } from "../features/rawMaterials";
import { ProductionRoutes } from "../features/production";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/products" replace />,
            },
            {
                path: "products/*",
                element: <ProductsRoutes />,
            },
            {
                path: "rawMaterials/*",
                element: <RawMaterialsRoutes />,
            },
            {
                path: "production/*",
                element: <ProductionRoutes />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
])