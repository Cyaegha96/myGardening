import { useEffect, useState } from "react";
import { MyPlantControllerApi, type MyPlantResponseDTO } from "@/shared/api";
import {useNavigate} from "react-router-dom";

export function MyPlantWidget() {
    const [plants, setPlants] = useState<MyPlantResponseDTO[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const api = new MyPlantControllerApi();
                const res = await api.getMyPlantList(); // swagger 자동생성된 API
                setPlants(res.data ?? []);
            } catch (err) {
                console.error("내 식물 조회 실패:", err);
            }
        };

        fetchPlants();
    }, []);

    if (plants.length === 0) {
        return <p className="text-sm text-muted-foreground">등록한 식물이 없습니다.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            {plants.map((plant) => (
                <div
                    key={plant.userPlantId}
                    onClick={() => navigate(`/my-plants/${plant.userPlantId}`)}
                    className="border rounded-lg p-3 hover:bg-muted/40 transition flex items-center gap-3"
                >
                    {plant.url ? (
                        <img
                            src={plant.url}
                            alt={plant.nickname ?? plant.commonName ?? "식물 이미지"}
                            className="w-16 h-16 object-cover rounded"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No Image
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{plant.nickname ?? plant.commonName}</span>
                        <span className="text-xs text-muted-foreground line-clamp-2">{plant.memo}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}