import type {MyPlantResponseDTO} from "@/shared/api";

export interface MyPlantCardProps {
    plant: MyPlantResponseDTO;
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
}