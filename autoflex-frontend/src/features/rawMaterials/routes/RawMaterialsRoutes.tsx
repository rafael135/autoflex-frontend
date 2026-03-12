import { Route, Routes } from "react-router-dom";
import RawMaterialsList from "../components/RawMaterialsList";

export const RawMaterialsRoutes = () => {
    return (
        <Routes>
            <Route path="/" index element={<RawMaterialsList />} />
        </Routes>
    );
};
