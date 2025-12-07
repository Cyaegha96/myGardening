import { create } from "zustand";
import type { SerializedEditorState } from "lexical";
import type { PotListImageDTO, PotListInsertDTO, PotListPatchDTO, PotListResponseDTO } from "@/shared/api";
import { potListApi } from "@/entities/potList/api/potListApi.ts";

type PotListWriteState = {
    title: string;
    description: SerializedEditorState | null;
    type: "SELL" | "BUY";
    price: number;
    isFree: boolean;
    location: string;

    existingImages: PotListImageDTO[];
    toDeleteImageIds: number[];
    newFiles: File[];
    tags: number[];
    thumbnailIndex: number;

    loading: boolean;

    // setters
    setTitle: (title: string) => void;
    setDescription: (desc: SerializedEditorState | null) => void;
    setType: (type: "SELL" | "BUY") => void;
    setPrice: (price: number) => void;
    setIsFree: (isFree: boolean) => void;
    setLocation: (location: string) => void;
    setExistingImages: (imgs: PotListImageDTO[]) => void;
    setToDeleteImageIds: (ids: number[]) => void;
    setNewFiles: (files: File[]) => void;
    setThumbnailIndex: (index: number) => void;
    setLoading: (loading: boolean) => void;

    addTag: (id: number) => void;
    toggleTag: (id: number) => void;

    // actions
    initialize: (data: PotListResponseDTO | null) => void;
    reset: () => void;
    submit: (mode: "create" | "edit", id?: number, onSubmitSuccess?: () => void) => Promise<void>;
};

export const usePotListWriteStore = create<PotListWriteState>((set, get) => ({
    title: "",
    description: null,
    type: "SELL",
    price: 0,
    isFree: false,
    location: "",
    existingImages: [],
    toDeleteImageIds: [],
    newFiles: [],
    tags: [],
    thumbnailIndex: 0,
    loading: false,

    toggleTag: (id: number) => {
        const state = get();

        if (state.tags.includes(id)) {
            set({tags: state.tags.filter(t => t !== id)});
        } else {
            set({tags: [...state.tags, id]});
        }
    },
    addTag: (id: number) => {
        const state = get();

        if(!state.tags.includes(id)) {
            set({tags: [...state.tags, id]});
        }
    },

    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setType: (type) => set({ type }),
    setPrice: (price) => set({ price }),
    setIsFree: (isFree) => set({ isFree }),
    setLocation: (location) => set({ location }),
    setExistingImages: (existingImages) => set({ existingImages }),
    setToDeleteImageIds: (toDeleteImageIds) => set({ toDeleteImageIds }),
    setNewFiles: (newFiles) => set({ newFiles }),
    setThumbnailIndex: (thumbnailIndex) => set({ thumbnailIndex }),
    setLoading: (loading) => set({ loading }),

    initialize: (data) => {
        if (!data) return;
        set({
            title: data.potListDetailDTO?.title ?? "",
            description: JSON.parse(data.potListDetailDTO?.description ?? "null"),
            type: data.potListDetailDTO?.type ?? "SELL",
            price: data.potListDetailDTO?.price ?? 0,
            isFree: (data.potListDetailDTO?.price ?? 0) === 0,
            location: data.potListDetailDTO?.location ?? "",
            existingImages: data.potListImageDTOList ?? [],
            thumbnailIndex: data.potListImageDTOList && data.potListDetailDTO?.thumbnail
                ? data.potListImageDTOList.findIndex(img => img.url === data.potListDetailDTO?.thumbnail)
                : 0,
        });
    },

    reset: () => {
        set({
            title: "",
            description: null,
            type: "SELL",
            price: 0,
            isFree: false,
            location: "",
            existingImages: [],
            toDeleteImageIds: [],
            newFiles: [],
            thumbnailIndex: 0,
            loading: false,
            tags: [],
        });
    },

    submit: async (mode, id, onSubmitSuccess) => {
        const {
            title, description, type, price, isFree,
            location, thumbnailIndex, tags,
            newFiles, toDeleteImageIds, setLoading
        } = get();

        if (!title.trim()) return alert("제목을 입력해주세요.");
        if (!description) return alert("설명을 입력해주세요.");

        setLoading(true);
        try {
            const descriptionString = JSON.stringify(description);

            if (mode === "create") {
                const payload: PotListInsertDTO = { title, description: descriptionString, type, price: isFree ? 0 : price, location, thumbnailIndex, tags };
                const res = await potListApi.createPot(payload, newFiles);
                if (res.status === 201) onSubmitSuccess?.();
                else alert("작성 실패");
            } else if (id) {
                const payload: PotListPatchDTO = { id, title, description: descriptionString, type, price: isFree ? 0 : price, location, thumbnailIndex, tags };
                const res = await potListApi.updatePot(id, payload, newFiles, toDeleteImageIds);
                if (res.status === 200) onSubmitSuccess?.();
                else alert("수정 실패");
            }
        } catch (err) {
            console.error(err);
            alert("오류 발생");
        } finally {
            setLoading(false);
        }
    },
}));
