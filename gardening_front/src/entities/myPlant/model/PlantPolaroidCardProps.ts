export interface PolaroidCardProps {
    imageUrl: string;
    lines: string[]; // diary.content split("\n") 결과 또는 MyPlant memoLines 텍스트 배열
    type?: "plant" | "diary";
    onClick?: () => void;
    width?: string;           // 기본 300px, 필요시 override
}