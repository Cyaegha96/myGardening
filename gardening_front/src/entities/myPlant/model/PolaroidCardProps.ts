export interface PolaroidCardProps {
    imageUrl: string;
    lines: string[];
    type?: "plant" | "diary";
    variant?: "tape" | "none";
    onClick?: () => void;
    width?: string;

    // 수정 모달 열기용 콜백
    onEdit?: () => void;

    // 삭제 확인용 콜백
    onDelete?: () => void;
}
