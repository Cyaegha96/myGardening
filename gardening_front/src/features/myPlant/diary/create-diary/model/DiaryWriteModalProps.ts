import type {MyPlantDiaryResponseDTO} from "@/shared/api";

export interface DiaryWriteModalProps {
    userPlantId: number;

    diary: MyPlantDiaryResponseDTO | null;

    onClose: () => void;
    onSubmit: (params: {
        content: string;
        weather: string;
        file: File | null;
        isDeleteImage?: boolean;
    }) => void;

    // 저장/수정 성공 시 후처리 (목록 새로고침 등)
    onSuccess: () => Promise<void>;
}
