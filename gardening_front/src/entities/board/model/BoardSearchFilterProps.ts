import type {PlantTagParentDTO} from "@/shared/api";

export interface BoardSearchFilterProps {
    tagParents: PlantTagParentDTO[];

    // 검색 박스
    onSearch: (keyword: string, type: string) => void;

    // 부모 태그 선택 핸들러
    onParentSelect: (parentId: number) => void;
}
