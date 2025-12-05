import type {Align} from "@/entities/myPlants/model/MemoLine.ts";
import type {SelectedTarget} from "@/entities/myPlants/model/SelectedTarget.ts";

// 제목 입력 컴포넌트에 전달할 props 정의
export interface PlantTitleEditorProps {
    // 제목 텍스트
    nickname: string;
    // 제목 정렬 상태
    nicknameAlign: Align;
    // 현재 선택된 타겟
    selectedTarget: SelectedTarget | null;

    // 제목 입력값 변경 핸들러
    onChangeNickname: (value: string) => void;
    // 제목 영역 클릭 시 선택 처리
    onSelectNickname: () => void;
}
