import {Route, Routes} from "react-router-dom";
import {lazy} from "react";

const PotListPage = lazy(() => import("@/pages/potList/PotListPage.tsx"));

export default function PotListRoutes(){
    return (
        <Routes>
            <Route path="/" element={<PotListPage/>}/>
        </Routes>
    );
}