import { Route, Routes } from "react-router-dom";
import ProductionView from "../components/ProductionView";

export const ProductionRoutes = () => {
    return (
        <Routes>
            <Route path="/" index element={<ProductionView />} />
        </Routes>
    );
};
