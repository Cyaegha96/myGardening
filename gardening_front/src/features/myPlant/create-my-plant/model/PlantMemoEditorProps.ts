// 메모 입력 텍스트 영역 컴포넌트에 전달할 props 정의
export interface PlantMemoEditorProps {
    // 메모 전체 텍스트 (줄바꿈 포함)
    memoText: string;
    // 메모 내용 변경 핸들러
    onChangeMemoText: (value: string) => void;
}
