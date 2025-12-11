import type { MyPlantDiaryResponseDTO } from "@/shared/api";

export interface RightPageWidgetProps {
    diariesOnPage:[];
    diary?: MyPlantDiaryResponseDTO;
    pageIdx: number;
    totalPages: number;
    hasNext: boolean;
    onNext: () => void;
    onOpenWrite: () => void;
    onSelectDate: (date: Date) => void;
    onEditDiary: () => void;
    onDeleteDiary: (diaryId: number) => void;
}
