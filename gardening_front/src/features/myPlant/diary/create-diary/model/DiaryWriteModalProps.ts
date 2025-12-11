import type {MyPlantDiaryResponseDTO} from "@/shared/api";

export interface DiaryWriteModalProps {
    userPlantId: number;

    diary: MyPlantDiaryResponseDTO | null;

    onClose: () => void;
    onSubmit: ({content, weather, deleteImage, file,}: {
        content: string;
        weather: string;
        deleteImage?: boolean;
        file: File | null;
    }) => void;

    // 저장/수정 성공 시 후처리 (목록 새로고침 등)
    onSuccess: () => Promise<void>;
}
