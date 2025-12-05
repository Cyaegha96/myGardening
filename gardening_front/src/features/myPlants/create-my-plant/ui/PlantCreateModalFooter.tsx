import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import type {PlantCreateModalFooterProps} from "@/features/myPlants/create-my-plant/model/PlantCreateModalFooterProps.ts";

// 모달 하단 버튼 두 개 (오른쪽 정렬)
export default function PlantCreateModalFooter({
                                                   onResetAll,
                                                   onSubmit,
                                               }: PlantCreateModalFooterProps) {
    // 버튼 두 개 (오른쪽 정렬)
    return (
        <div className="flex justify-end gap-2 mt-6">
            <Button
                variant="destructive"
                className="px-4 py-2 text-sm"
                onClick={onResetAll}
            >
                전체 초기화
            </Button>
            <Button
                variant="default"
                className="px-4 py-2 text-sm"
                onClick={onSubmit}
            >
                등록하기
            </Button>
        </div>
    );
}
