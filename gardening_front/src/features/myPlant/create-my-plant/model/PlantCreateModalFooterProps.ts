// 모달 하단 버튼 영역 컴포넌트에 전달할 props 정의
export interface PlantCreateModalFooterProps {
    mode: "create" | "edit";
    onResetAll?: () => void;
    onSubmit: () => void;
}

