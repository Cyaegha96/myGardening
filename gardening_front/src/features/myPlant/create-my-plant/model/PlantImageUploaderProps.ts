import type {MemoLine} from "@/entities/myPlant/model/MemoLine.ts";

// 이미지 업로드 / 미리보기 카드 컴포넌트에 전달할 props 정의
export interface PlantImageUploaderProps {
    // 현재 모드 - 내 식물 등록인지, 다이어리인지
    mode: "plant" | "diary"
    // 현재 선택된 이미지 미리보기 URL (없으면 "noImage")
    imagePreview: string;
    // 드래그 중 여부
    isDragging: boolean;
    // 이미지가 세로형인지 여부 (세로 >= 가로)
    isPortrait: boolean;
    // 학명 대신 보여줄 익숙한 이름
    commonName: string;
    // 제목 텍스트
    nickname: string;

    // 메모 각 줄 정보 (텍스트)
    memoLines: MemoLine[];

    // 파일 input change 핸들러
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // 드래그 오버 핸들러
    onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
    // 드래그 leave 핸들러
    onDragLeave: () => void;
    // 드롭 핸들러
    onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;

    // 이미지 X 버튼 클릭 시 호출
    onClearImage: () => void;

    // 파일 input 을 제어하기 위한 ref (전체 초기화 시 value 비우기 위함)
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}
