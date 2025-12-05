import type {Align} from "@/entities/myPlants/model/MemoLine.ts";
import type {SelectedTarget} from "@/entities/myPlants/model/SelectedTarget.ts";

export interface AlignmentToolbarProps {
    currentAlign: Align;
    selectedTarget: SelectedTarget | null;
    onApplyAlign: (align: Align) => void;
}