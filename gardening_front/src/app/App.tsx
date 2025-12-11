import {Header} from "@/widgets/header/Header.tsx";
import {BrowserRouter} from "react-router-dom";
import {CommonRoutes} from '@/app/router/index.js';
import {useEffect} from "react";
import {getStoredTokens} from "@/entities/auth/api.ts";
import {type AuthState, useAuthStore} from "@/entities/auth/useAuthStore.tsx";
import useUserStore from "@/app/store/userStore";
import {Toaster} from "sonner";
import MinimalChatBox from "@/shared/shadcn/components/ui/minimal-chat-box.tsx";
import {stompClient} from "@/shared/config/stompClient.ts";
import NotificationFloatingBox from "@/features/notification/NotificationFloatingBox.tsx";

function App() {
    //기본 로그인
    const setTokens = useAuthStore((s: AuthState) => s.setTokens);
    const initUser = useUserStore(state => state.init);
    const userUid = useUserStore(state => state.uid);

    useEffect(() => {
        const {access, refresh} = getStoredTokens();
        if (access && refresh) {
            setTokens(access, refresh);
            // UID 저장
            initUser();
            stompClient.activate();
        }

        return () => {
            stompClient.deactivate();
        }
    }, [setTokens, initUser]);

    return (
        <BrowserRouter>
            {userUid &&
                <NotificationFloatingBox/>
            }
            <MinimalChatBox/>
            <Toaster/>
            <Header/>
            <CommonRoutes/>
        </BrowserRouter>
    )
}

export default App
