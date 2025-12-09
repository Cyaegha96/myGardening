// 제목 입력 컴포넌트에 전달할 props 정의
export interface PlantTitleEditorProps {
    // 제목 텍스트
    nickname: string;

    // 제목 입력값 변경 핸들러
    onChangeNickname: (value: string) => void;
}
