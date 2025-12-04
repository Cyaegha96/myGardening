import {create} from "zustand";
import {TerrariumAssetImageControllerApi} from "@/shared/api";

export type PanelType = "images"|"icons"|"myDesigns"|null;
const assetApi = new TerrariumAssetImageControllerApi();

export interface PanelItem{
    id: number | string;
    url: string;
    sysName?:string;
    oriName?:string;
    name?:string;
}

interface PanelStore{
    panelType:PanelType;
    items:PanelItem[];
    isOpen:boolean;

    setPanelType:(type:PanelType)=>void;
    setItems:(items:PanelItem[])=>void;

    open: () => void;
    close: () => void;
    toggle: () => void;

    loadAssets: () => Promise<void>;
}

export const usePanelStore = create<PanelStore>((set, get) => ({
    panelType: null,
    items: [],
    isOpen: false,

    setPanelType: (type) => set({ panelType: type }),
    setItems: (items) => set({ items }),

    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set({ isOpen: !get().isOpen }),

    loadAssets: async () => {
        try {
            const response = await assetApi.getAllAssets(); // axiosInterceptor가 자동으로 헤더 처리
            const items = response.data.map((img) => ({
                id: img.id!,
                url: img.url!,
                name: img.name || "",
            }));
            set({ items, panelType: "images", isOpen: true });
        } catch (err) {
            console.error("공용 이미지 로드 실패", err);
        }
    },
}));