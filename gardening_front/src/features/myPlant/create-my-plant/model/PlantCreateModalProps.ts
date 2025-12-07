import type {MyPlantDTO} from "@/shared/api";

export interface PlantCreateModalProps {
    onClose: () => void;
    // 부모에게 전달할 데이터 타입 지정
    onSend?: (data: {
        plantInfo: MyPlantDTO;
        file: File;
    }) => void;
}