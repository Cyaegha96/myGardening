import {Route, Routes} from "react-router-dom";
import {lazy} from "react";
import {ProtectedRoute} from "@/app/router/ProtectedRoute.tsx";

const BoardPage = lazy(() => import("@/pages/board/BoardListPage"));
const DetailBoardPage = lazy(() => import("@/pages/board/DetailBoardPage"));
const WriteBoardPage = lazy(() => import("@/pages/board/WriteBoardPage"));

export default function BoardRoutes(){
    return (
        <Routes>
            {/* 로그인 필요 없음 */}
            <Route path="/" element={<BoardPage/>}/>
            <Route path="detail" element={<DetailBoardPage/>}/>

            {/* 로그인 필요 있음 */}
            <Route path="write" element={<ProtectedRoute><WriteBoardPage/></ProtectedRoute>}/>
        </Routes>
    );
}