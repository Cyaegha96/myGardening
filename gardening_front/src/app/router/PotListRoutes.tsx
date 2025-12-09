import {Route, Routes} from "react-router-dom";
import {lazy} from "react";
import PotBookmarkDrawer from "@/features/potList/ui/PotBookmarkDrawer.tsx";
import ChatDrawer from "@/features/potList/ui/ChatDrawer.tsx";

const PotListPage = lazy(() => import("@/pages/potList/PotListPage.tsx"));
const PotWritePage = lazy(() => import("@/pages/potList/PotListWritePage.tsx"));
const PotDetailPage = lazy(() => import("@/pages/potList/PotListDetailPage.tsx"));

export default function PotListRoutes() {
    return (
        <>
            <PotBookmarkDrawer/>
            <ChatDrawer/>
            <Routes>
                <Route path="/" element={<PotListPage/>}/>
                <Route path="write" element={<PotWritePage mode="create"/>}/>
                <Route path="edit/:id" element={<PotWritePage mode="edit"/>}/>
                <Route path=":id" element={<PotDetailPage/>}/>
            </Routes>
        </>
    );
}