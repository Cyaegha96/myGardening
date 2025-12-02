import {Route, Routes} from "react-router-dom";
import {lazy} from "react";
import ChatDrawer from "@/features/potList/ui/ChatDrawer.tsx";

const PotListPage = lazy(() => import("@/pages/potList/PotListPage.tsx"));

export default function PotListRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <>
                    <ChatDrawer/>
                    <PotListPage/>
                </>
            }/>
        </Routes>
    );
}