import type {MyPlantDTO} from "@/shared/api";

export interface PlantCreateModalProps {
    mode: "create" | "edit";
    defaultValues?: {
        userPlantId: number;
        imageUrl: string;
        plantScientificName: string;
        commonName: string;
        nickname?: string;
        memo?: string;
        acquiredAt?: string;
    };
    onClose: () => void;
    onSend?: (data: { plantInfo: MyPlantDTO; file: File }) => void;
    onUpdate?: (data: { plantInfo: MyPlantDTO; file: File }) => void;
}
