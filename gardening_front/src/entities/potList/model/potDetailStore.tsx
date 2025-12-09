import {create} from "zustand";
import type {PotListDetailDTO, PotListImageDTO} from "@/shared/api";
import {potListApi} from "@/entities/potList/api/potListApi.ts";

type PotDetailState = {
    potDetail: PotListDetailDTO | undefined;
    images: PotListImageDTO[] | [];
    otherPotList: PotListDetailDTO[] | [];

    getDetail: (id: number) => void;

    setBookmarkCount: (count:number) => void;
    setOtherPotBookmarkCount: (id:number, count:number) => void;
};

export const usePotDetailStore = create<PotDetailState>((set, get) => ({
    potDetail: undefined,
    images: [],
    otherPotList: [],

    getDetail: async (id: number) => {
        const resp = await potListApi.getPotDetail(id);

        set({
            potDetail: resp.data.potListDetailDTO,
            images: resp.data.potListImageDTOList,
            otherPotList: resp.data.otherPotList,
        })
    },

    setBookmarkCount: (count: number) => {
        const state = get();

        set({
            potDetail: {...state.potDetail, bookmarkCount: count}
        })
    },

    setOtherPotBookmarkCount: (id:number, count: number) => {
        const state = get();

        set({
            otherPotList: state.otherPotList.map(pot =>
                pot.id === id ? { ...pot, bookmarkCount: count } : pot
            )
        });
    }
}));
