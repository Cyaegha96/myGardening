import {Route, Routes} from "react-router-dom";
import {lazy} from "react";
import ChatDrawer from "@/features/potList/ui/ChatDrawer.tsx";
import PotBookmarkDrawer from "@/features/potList/ui/PotBookmarkDrawer.tsx";
import BoardDetailHeader from "@/widgets/board/BoardDetailHeader.tsx";
import BoardSearchFilter from "@/widgets/board/BoardSearchFilter.tsx";

const PotListPage = lazy(() => import("@/pages/potList/PotListPage.tsx"));

export default function PotListRoutes() {
    return (
        <Routes>
            <Route path="/" element={
                <>
                    <PotBookmarkDrawer/>
                    <ChatDrawer/>
                    <PotListPage/>
                </>
            }/>
        </Routes>
    );
}