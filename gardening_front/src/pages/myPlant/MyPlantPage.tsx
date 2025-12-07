import { useEffect, useState } from "react";
import { Button } from "@/shared/shadcn/components/ui/button";
import { PlantCreateModal } from "@/features/myPlant/create-my-plant/ui/PlantCreateModal.tsx";
import {
    MyPlantControllerApi,
    type MyPlantDTO,
    type MyPlantResponseDTO
} from "@/shared/api";
import { toast } from "sonner";
import PolaroidCard from "@/entities/myPlant/ui/PolaroidCard.tsx";
import { useNavigate } from "react-router-dom";

export default function MyPlantPage() {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [plants, setPlants] = useState<MyPlantResponseDTO[]>([]);
    const myPlantApi = new MyPlantControllerApi();

    // 식물 목록 조회
    const fetchPlants = async () => {
        try {
            const res = await myPlantApi.getMyPlantList();
            setPlants(res.data ?? []);
        } catch (err) {
            console.error("식물 목록 조회 실패:", err);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    // 식물 저장/등록 처리
    const handleRegister = async (data: { plantInfo: MyPlantDTO; file: File }) => {
        try {
            await myPlantApi.insertMyPlant(data.plantInfo, data.file);
            toast.success("식물 등록 완료!");
            setOpen(false);
            await fetchPlants();
        } catch (err) {
            console.error(err);
            toast.error("등록 중 문제가 발생했습니다.");
        }
    };

    return (
        <main className="mx-auto h-full w-full max-w-5xl px-4 py-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">내 식물</h1>
                <Button onClick={() => setOpen(true)}>식물 추가</Button>
            </div>

            {/* 식물 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {plants.map(p => (
                    <PolaroidCard
                        key={p.userPlantId} // key 속성 추가
                        type="plant"
                        variant="none"
                        imageUrl={p.url ?? ""} // 대표이미지 응답 필드 확인 필요
                        lines={[
                            p.commonName ?? "",
                            p.nickname ?? "",
                            ...(p.memo ? p.memo.split("\n") : [])
                        ]}
                        onClick={() => navigate(`/my-plants/${p.userPlantId}`)}
                    />
                ))}
            </div>

            {/* 식물 등록 모달 */}
            {open && (
                <PlantCreateModal
                    onClose={() => setOpen(false)}
                    onSend={handleRegister}
                />
            )}
        </main>
    );
}
