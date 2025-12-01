import { useState } from "react";
import { Button } from "@/shared/shadcn/components/ui/button";
import PlantCreateModal from "@/entities/myPlants/ui/PlantCreateModal";

export default function MyPlantsPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full h-full p-6">
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">내 식물</h1>

                {/* shared Button 사용 */}
                <Button
                    variant="default"
                    size="default"
                    onClick={() => setOpen(true)}
                >
                    식물 추가
                </Button>
            </div>

            {/* 식물 목록 자리 */}
            <div>
                {/* 추후 리스트 들어갈 공간 */}
            </div>

            {/* 모달 */}
            {open && (
                <PlantCreateModal
                    onClose={() => setOpen(false)}
                    onSubmit={() => {
                        // 등록 처리 후 모달 닫기
                        setOpen(false);
                    }}
                />
            )}
        </div>
    );
}
