import type {PlantTagParentDTO} from "@/shared/api";

export interface BoardTagFilterProps {
    tagParents: PlantTagParentDTO[];
    onParentSelect: (parentId: number) => void;
}