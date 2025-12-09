import type { MyPlantResponseDTO } from "@/shared/api";

export interface LeftPageWidgetProps {
    plant: MyPlantResponseDTO | null;
    pageIdx: number;
    hasPrev: boolean;
    onPrev: () => void;
    onOpenChangeImage: () => void;
    onOpenHistory: () => void;
}
