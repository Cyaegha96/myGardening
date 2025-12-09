import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const MyPlantPage = lazy(() => import("@/pages/myPlant/MyPlantPage"));
const PlantDetailPage = lazy(() => import("@/pages/myPlant/PlantDetailPage"));

export default function myPlantRoutes() {
    return (
        <Routes>
            {/* 목록 */}
            <Route path="/" element={<MyPlantPage />} />

            {/* 상세 */}
            <Route path=":userPlantId" element={<PlantDetailPage />} />
        </Routes>
    );
}
