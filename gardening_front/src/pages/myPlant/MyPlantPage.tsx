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
    const myPlantApi = new MyPlantControllerApi();

    const [plants, setPlants] = useState<MyPlantResponseDTO[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<MyPlantResponseDTO | null>(null);

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

    // 신규 저장
    const handleCreate = async (data: { plantInfo: MyPlantDTO; file: File }) => {
        try {
            await myPlantApi.insertMyPlant(data.plantInfo, data.file);
            toast.success("식물 등록 완료");
            setModalOpen(false);
            await fetchPlants();
        } catch (err) {
            console.error(err);
            toast.error("등록 실패");
        }
    };

    // 수정 요청
    const handleEdit = (plant: MyPlantResponseDTO) => {
        setEditTarget(plant);
        setModalOpen(true);
    };

    // 수정 요청 처리
    const handleUpdate = async (data: { plantInfo: MyPlantDTO; file: File }) => {
        try {
            await myPlantApi.updateMyPlant(data.plantInfo, data.file ?? undefined);
            toast.success("수정 완료");
            setModalOpen(false);
            setEditTarget(null);
            await fetchPlants();
        } catch (err) {
            console.error(err);
            toast.error("수정 실패");
        }
    };

    // 삭제 요청
    const handleDelete = async (userPlantId: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            await myPlantApi.deleteMyPlant(userPlantId);
            toast.success("삭제 완료");
            await fetchPlants();
        } catch (err) {
            console.error(err);
            toast.error("삭제 실패");
        }
    };

    return (
        <main className="mx-auto h-full w-full max-w-5xl px-4 py-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">내 식물</h1>
                <Button
                    onClick={() => {
                        setEditTarget(null); //등록 모드
                        setModalOpen(true);
                    }}
                >
                    식물 추가
                </Button>
            </div>

            {/* 식물 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {plants.map(plant => (
                    <PolaroidCard
                        key={plant.userPlantId}
                        type="plant"
                        variant="none"
                        imageUrl={plant.url ?? ""}
                        width="300px"
                        lines={[
                            plant.commonName ?? "",
                            plant.nickname ?? "",
                            ...(plant.memo ? plant.memo.split("\n") : [])
                        ]}
                        onClick={() => navigate(`/my-plants/${plant.userPlantId}`)}
                        onEdit={() => handleEdit(plant)}
                        onDelete={() => handleDelete(Number(plant.userPlantId))}
                    />
                ))}
            </div>

            {/* 등록/수정 모달 */}
            {modalOpen && (
                <>
                    {editTarget ? (
                        <PlantCreateModal
                            mode="edit"
                            defaultValues={{
                                userPlantId: editTarget.userPlantId!,
                                imageUrl: editTarget.url ?? "",
                                plantScientificName: editTarget.plantScientificName ?? "",
                                commonName: editTarget.commonName ?? "",
                                nickname: editTarget.nickname ?? "",
                                memo: editTarget.memo ?? "",
                                acquiredAt: editTarget.acquiredAt
                            }}
                            onClose={() => {
                                setModalOpen(false);
                                setEditTarget(null);
                            }}
                            onUpdate={handleUpdate}
                        />
                    ) : (
                        <PlantCreateModal
                            mode="create"
                            onClose={() => setModalOpen(false)}
                            onSend={handleCreate}
                        />
                    )}
                </>
            )}
        </main>
    );
}
