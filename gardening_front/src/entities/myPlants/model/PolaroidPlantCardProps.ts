import type {Align, MemoLine} from "@/entities/myPlants/model/MemoLine.ts";

export interface PolaroidPlantCardProps {
    imageUrl: string;
    name: string;
    memoLines: MemoLine[];
    titleAlign?: Align;
    onClick?: () => void;
}
