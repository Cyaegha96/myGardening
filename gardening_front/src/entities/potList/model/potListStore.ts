import {create} from "zustand";
import type {PlantTagDTO, PlantTagParentDTO, PotListDetailDTO} from "@/shared/api";
import {potListApi} from "@/entities/potList/api/potListApi.ts";
import {plantTagApi} from "@/entities/plantTag/api/plantTagApi.ts";

type PotListStore = {
    potLists: PotListDetailDTO[];
    bookmarkPotLists: PotListDetailDTO[];
    tagFilterList: { parentTag: PlantTagParentDTO, tagList: PlantTagDTO[] }[];

    cursorId: number | undefined;
    size: number | undefined;
    keyword: string | undefined;
    searchType: string | undefined;

    isLoading: boolean;

    selectedTags: number[];
    toggleSelectedTags: (id: number) => void;

    fetchPotList: () => void;
    fetchBookmarkPotLists: () => void;
    fetchPotTagList: () => void;

    setKeyword: (keyword: string) => void;
    setSearchType: (searchType: string) => void;
    setCursorId: (id: number) => void;
};

export const usePotListStore = create<PotListStore>((set, get) => ({
    potLists: [],
    bookmarkPotLists: [],
    tagFilterList: [],

    cursorId: undefined,
    size: undefined,
    keyword: undefined,
    searchType: "all",

    isLoading: false,

    selectedTags: [],

    fetchPotList: async () => {
        const {
            cursorId,
            size,
            keyword,
            searchType,
            selectedTags,
            potLists,
        } = get();

        try {
            set({isLoading: true});

            const resp = await potListApi.getPotList(
                cursorId,
                size,
                keyword,
                searchType,
                selectedTags
            );

            const newItems = resp.data;

            // 데이터 없음 → 더 불러올 게 없음
            if (newItems.length === 0) {
                return [];
            }

            // 다음 커서 = 마지막 item의 id
            const nextCursorId = newItems[newItems.length - 1].id;

            // 첫 페이지라면 덮어쓰기
            if (cursorId === null) {
                set({
                    potLists: newItems,
                    cursorId: nextCursorId,
                });
            } else {
                // 이후 페이지 → append
                set({
                    potLists: [...potLists, ...newItems],
                    cursorId: nextCursorId,
                });
            }

            return newItems;
        } catch (error) {
            console.error("Failed to fetch pot lists:", error);
            set({isLoading: false});
            return [];
        }
    },

    fetchBookmarkPotLists: async () => {
        try {
            const resp = await potListApi.getBookmarksByUserId();
            set({bookmarkPotLists: resp.data});
        } catch (error) {
            console.error("Failed to fetch pot lists:", error);
        }
    },

    fetchPotTagList: async () => {
        set({isLoading: true});

        try {
            const resp: { data: PlantTagParentDTO[] } = await plantTagApi.getTagParents();

            const results = [];

            // 부모 태그 하나씩 순차 처리
            for (const parentTag of resp.data) {
                if (parentTag.tagId != null) {
                    const tagList: { data: PlantTagDTO[] } = await plantTagApi.getTagListByParentId(parentTag.tagId);

                    results.push({
                        parentTag: parentTag,
                        tagList: tagList.data,
                    });
                }
            }

            // 최종적으로 한 번에 store 업데이트
            set({
                tagFilterList: results,
                isLoading: false
            });
        } catch (error) {
            console.error("Failed to fetch pot lists:", error);
            set({isLoading: false});
        }
    },

    toggleSelectedTags: (id: number) => {
        set(state => ({selectedTags: state.selectedTags.includes(id) ? state.selectedTags.filter(x => x !== id) : [...state.selectedTags, id]}));

        const {fetchPotList} = get();
        fetchPotList();
    },

    setKeyword: (keyword: string) => set(() => ({keyword: keyword})),
    setSearchType: (searchType: string) => set(() => ({searchType: searchType})),
    setCursorId: (id: number) => set(() => ({cursorId: id})),
}));
