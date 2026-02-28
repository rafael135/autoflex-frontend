import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ProductsRoutes } from "../features/products";
import { RawMaterialsRoutes } from "../features/rawMaterials";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "products/*",
                index: true,
                element: <ProductsRoutes />
            },
            {
                path: "rawMaterials/*",
                element: <RawMaterialsRoutes />
            },
            }
        ]
    }
])