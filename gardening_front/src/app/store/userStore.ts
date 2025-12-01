import { create } from "zustand";
import { getLoginUid } from "@/shared/libs/getLoginUid";

interface UserState {
    uid: string | null;
    init: () => void;
}

const useUserStore = create<UserState>((set) => ({
    uid: null,

    init: () => {
        const uid = getLoginUid();
        set({ uid });
    },

    logout: () => set({uid:null}),

}));

export default useUserStore;
