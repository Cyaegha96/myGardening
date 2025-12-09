import type { MyPlantDiaryResponseDTO } from "@/shared/api";

export interface DiaryPageProps {
    diary?: MyPlantDiaryResponseDTO;
    onEdit: () => void;
    onDelete: (diaryId: number) => void;
}
