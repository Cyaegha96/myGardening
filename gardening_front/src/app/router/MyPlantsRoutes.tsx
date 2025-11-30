import {Route, Routes} from "react-router-dom";
import {lazy} from "react";

const MyPlantsPage = lazy(() => import("@/pages/myPlants/MyPlantsPage"));

export default function MyPlantsRoutes(){
    return (
        <Routes>
            <Route path="/" element={<MyPlantsPage/>}/>
    </Routes>
);
}