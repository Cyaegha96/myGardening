// 모달 하단 버튼 영역 컴포넌트에 전달할 props 정의
export interface PlantCreateModalFooterProps {
    // 전체 초기화 버튼 클릭 핸들러
    onResetAll: () => void;
    // 등록하기 버튼 클릭 핸들러
    onSubmit: () => void;
}
