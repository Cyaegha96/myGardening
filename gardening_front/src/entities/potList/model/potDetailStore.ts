import {create} from "zustand";
import type {PotListDetailDTO, PotListImageDTO, PotListReportInsertDTO} from "@/shared/api";
import {potListApi} from "@/entities/potList/api/potListApi.ts";

type PotDetailState = {
    potDetail: PotListDetailDTO | undefined;
    images: PotListImageDTO[] | [];
    otherPotList: PotListDetailDTO[] | [];

    getDetail: (id: number) => void;

    submitReport: (reason: string) => void;

    deletePot: () => void;

    bumpPot: () => void;

    setAfterTrade: () => void;
    setBeforeTrade: () => void;
    setPendingTrade: () => void;

    setBookmarkCount: (count: number) => void;
    setOtherPotBookmarkCount: (id: number, count: number) => void;
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


    submitReport: (reason: string) => {
        const state = get();
        const reportInfo: PotListReportInsertDTO = {reason: reason};

        if (state.potDetail?.id != null) {
            potListApi.reportPot(state.potDetail.id, reportInfo).then((resp) => {
                if (resp.status === 200) {
                    alert("신고가 완료되었습니다.");
                } else {
                    alert("신고에 실패하였습니다. 다시시도해주세요.")
                }
            });
        }
    },

    deletePot: () => {
        const state = get();
        if (state.potDetail?.id != null) {
            potListApi.deletePot(state.potDetail.id)
        }
    },

    bumpPot: () => {
        const state = get();
        if (state.potDetail?.id != null) {
            potListApi.refreshPot(state.potDetail.id).then(resp => {
                if (resp.status === 204) {
                    alert("끌어올리기가 완료되었습니다.");
                } else {
                    alert("끌어올리기에 실패하였습니다. 다시시도해주세요.")
                }
            }).catch(err => {
                if (err.status === 425) {
                    alert("마지막 끌어올리기로 부터 3시간이 지나야 합니다.");
                } else {
                    alert("끌어올리기에 실패하였습니다. 다시시도해주세요.")
                }
            })
        }
    },

    setBeforeTrade: () => {
        const state = get();
        if (state.potDetail?.id != null) {
            potListApi.beforePot(state.potDetail.id).then(() => {
                set(prev => ({
                    potDetail: {...prev.potDetail, status: "BEFORE_TRADE"}
                }))
            })
        }
    },

    setAfterTrade: () => {
        const state = get();
        if (state.potDetail?.id != null) {
            potListApi.completePot(state.potDetail.id).then(() => {
                set(prev => ({
                    potDetail: {...prev.potDetail, status: "AFTER_TRADE"}
                }))
            })
        }
    },

    setPendingTrade: () => {
        const state = get();
        if (state.potDetail?.id != null) {
            potListApi.reservePot(state.potDetail.id).then(() => {
                set(prev => ({
                    potDetail: {...prev.potDetail, status: "PENDING_TRADE"}
                }))
            })
        }
    },

    setBookmarkCount: (count: number) => {
        const state = get();

        set({
            potDetail: {...state.potDetail, bookmarkCount: count}
        })
    },

    setOtherPotBookmarkCount: (id: number, count: number) => {
        const state = get();

        set({
            otherPotList: state.otherPotList.map(pot =>
                pot.id === id ? {...pot, bookmarkCount: count} : pot
            )
        });
    }
}));
