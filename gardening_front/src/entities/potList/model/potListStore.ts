import {create} from "zustand";
import type {PotListDetailDTO} from "@/shared/api";
import {potListApi} from "@/entities/potList/api/potListApi.ts";

type PotListStore = {
    potLists: PotListDetailDTO[];
    isLoading: boolean;

    fetchPotList: (cursorId:number|undefined, size:number|undefined, keyword:string|undefined, categoryId:number[]|undefined) => void;
};

export const usePotListStore = create<PotListStore>((set) => ({
    potLists: [],
    isLoading: false,

    fetchPotList: async (cursorId, size, keyword, categoryId) => {
        set({ isLoading: true });
        try {
            // API 호출
            const resp = await potListApi.getPotList(cursorId, size, keyword, categoryId);
            set({ potLists: resp.data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch pot lists:", error);
            set({ isLoading: false });
        }
    },
}));
