import { useEffect, useState } from "react";
import { Button } from "@/shared/shadcn/components/ui/button";
import {PlantCreateModal} from "@/features/myPlants/create-my-plant/ui/PlantCreateModal.tsx";
import { MyPlantControllerApi, type MyPlantDTO } from "@/shared/api";
import { toast } from "sonner";

export default function MyPlantsPage() {
    const [open, setOpen] = useState(false);
    const [plants, setPlants] = useState<MyPlantDTO[]>([]);

    const myPlantApi = new MyPlantControllerApi();

    /** 목록 로딩 함수 (중복 선언 금지!) */
    const fetchPlants = async () => {
        try {
            const res = await myPlantApi.getMyPlantList();
            setPlants(res.data ?? []);
        } catch (err) {
            console.error("식물 목록 조회 실패:", err);
        }
    };

    /** 첫 로딩 */
    useEffect(() => {
        (async () => {
            await fetchPlants();
        })();
    }, []);


    /** 등록 */
    const handleRegister = async (data: {
        plantInfo: MyPlantDTO;
        file: File;
    }) => {
        try {
            await myPlantApi.insertMyPlant(data.plantInfo, data.file);

            toast.success("식물 등록 완료 🌱");
            setOpen(false);

            await fetchPlants(); // 등록 후 목록 갱신
        } catch (err) {
            console.error("등록 실패:", err);
            toast.error("등록 중 문제가 발생했습니다.");
        }
    };

    return (
        <div className="w-full h-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">내 식물</h1>
                <Button onClick={() => setOpen(true)}>식물 추가</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {plants.map(p => (
                    <div key={p.userPlantId} className="border rounded p-3">
                        <div className="font-semibold">{p.nickname || "이름없음"}</div>
                        <div className="text-xs text-gray-500">{p.plantScientificName}</div>
                    </div>
                ))}
            </div>

            {open && (
                <PlantCreateModal
                    onClose={() => setOpen(false)}
                    onSend={handleRegister}
                />
            )}
        </div>
    );
}
