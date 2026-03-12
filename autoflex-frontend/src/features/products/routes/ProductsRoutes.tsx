import { Route, Routes } from "react-router-dom";
import ProductsList from "../components/ProductsList";


export const ProductsRoutes = () => {

    return(
        <Routes>
            <Route path="/" index element={<ProductsList />} />
        </Routes>
    )
}