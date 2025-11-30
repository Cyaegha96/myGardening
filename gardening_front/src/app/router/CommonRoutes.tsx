import {Outlet, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import {ProtectedRoute} from "@/app/router/ProtectedRoute.tsx";
import FlowerShop from "@/pages/flowerShop/FlowerShop.tsx";
import SearchPlantDictPage from "@/pages/searchPlant/SearchPlantDictPage.tsx";
import SearchPlantMainPage from "@/pages/searchPlant/SearchPlantMainPage.tsx";
import PlantThree from "@/pages/test/PlantThree.tsx";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const OAuthRedirectHandler = lazy(() => import("@/pages/auth/handler/OAuthRedirectHandler"));
const HomePage = lazy(() => import("@/pages/home/HomePage"));
const DashboardPage = lazy(() => import("@/pages/auth/DashboardPage"));
const InitialCompleteProfilePage = lazy(() => import("@/pages/auth/InitialCompleteProfilePage"));
const EditCompleteProfilePage = lazy(() => import("@/pages/auth/EditCompleteProfilePage"));
const SearchPlantPage = lazy(() => import("@/pages/searchPlant/SearchPlantPage"));
const ScheduleRoutes = lazy(() => import("./ScheduleRoutes"));
const BoardRoutes = lazy(() => import("./BoardRoutes"));

export function CommonRoutes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {/* 로그인 필요 없는 라우트 */}
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/oauth/redirect" element={<OAuthRedirectHandler />} />
                <Route path="/board/*" element={<BoardRoutes/>}/>
                <Route path="*" element={<HomePage />} />

                {/* 로그인 필요 라우트 그룹 */}
                <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                    <Route path="/auth/dashboard" element={<DashboardPage />} />
                    <Route path="/oauth/initial-complete-profile" element={<InitialCompleteProfilePage />} />
                    <Route path="/oauth/edit-complete-profile" element={<EditCompleteProfilePage />} />
                    <Route path="/plant-search/image" element={<SearchPlantPage />} />
                    <Route path="/schedule" element={<ScheduleRoutes />} />
                    <Route path="flower-shop" element={<FlowerShop/>}></Route>
                    <Route path="/plant-search/dict" element={<SearchPlantDictPage/>} />
                    <Route path="/plant-search" element={<SearchPlantMainPage/>} />
                    <Route path="/plant-test" element={<PlantThree/>}></Route>
                </Route>
            </Routes>
        </Suspense>
    );
}