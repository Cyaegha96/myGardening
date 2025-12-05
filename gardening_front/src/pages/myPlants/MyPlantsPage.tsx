import { useState } from "react";
import { Button } from "@/shared/shadcn/components/ui/button";
import {PlantCreateModal} from "@/features/myPlants/create-my-plant/ui/PlantCreateModal.tsx";

// API
import { MyPlantControllerApi } from "@/shared/api";

// 알림
import { toast } from "sonner";

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

                    // ⭐ 모달 내부에서 onSend 호출 시, 여기에서 등록 처리
                    onSend={async ({ plantInfo, file }) => {

                        // API 객체 생성
                        const api = new MyPlantControllerApi();

                        try {
                            // ⭐ 게시판 등록 방식과 동일 — DTO + File 동시 전송
                            await api.insertMyPlant(plantInfo, file ?? undefined);

                            toast.success("식물 등록 완료!");

                            // 등록 이후 모달 닫기
                            setOpen(false);

                            // 이후 목록 새로고침 로직이 들어올 수 있음 (예: refetch)
                        } catch (error) {
                            console.error("식물 등록 실패:", error);
                            toast.error("등록 실패!");
                        }
                    }}
                />
            )}
        </div>
    );
}
