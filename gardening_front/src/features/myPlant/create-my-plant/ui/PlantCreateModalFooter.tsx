import { Button } from "@/shared/shadcn/components/ui/button.tsx";
import type {
    PlantCreateModalFooterProps
} from "@/features/myPlant/create-my-plant/model/PlantCreateModalFooterProps.ts";

// 모달 하단 버튼 두 개 (오른쪽 정렬)
export default function PlantCreateModalFooter({
                                                   mode,
                                                   onResetAll,
                                                   onSubmit,
                                                   disabled, // 등록 버튼 비활성화 여부
                                               }: PlantCreateModalFooterProps) {

    // 버튼 두 개 (오른쪽 정렬)
    return (
        <div className="flex justify-end gap-2 mt-6">
            <Button
                variant="destructive"
                className="px-4 py-2 text-sm"
                onClick={!disabled ? onResetAll : undefined} // 저장 중 초기화도 방지
                disabled={disabled} // 비활성화 스타일 적용
            >
                전체 초기화
            </Button>

            <Button
                variant="default"
                className={`px-4 py-2 text-sm ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={!disabled ? onSubmit : undefined}
                disabled={disabled}
            >
                {mode === "create" ? "등록" : "수정 완료"}
            </Button>
        </div>
    );
}
