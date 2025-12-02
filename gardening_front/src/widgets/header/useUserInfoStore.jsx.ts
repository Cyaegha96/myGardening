import { create } from 'zustand';
import {getUserInfo} from "@/entities/auth/api.ts";
interface UserInfoState {
    userInfo: {
        nickname?: string;
        profileUrl?: string;
    };
    setUserInfo: (info: Partial<UserInfoState['userInfo']>) => void;
    fetchUserInfo: () => Promise<void>;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
    userInfo: {},

    setUserInfo: (info) =>
        set((state) => ({
            userInfo: { ...state.userInfo, ...info }
        })),

    fetchUserInfo: async () => {
        try {
            const data = await getUserInfo();
            set({ userInfo: data });
        } catch (err) {
            console.error("유저 정보 로딩 실패", err);
        }
    }
}));
