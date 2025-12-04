import {TopThreePlants} from "@/features/PopularPlants/ui/Top3Plants.tsx";
import {PopularPlantsList} from "@/features/PopularPlants/ui/PopularPlantsList.tsx";
import {usePopularPlants} from "@/entities/PopularPlants/lib/usePopularPlants.ts";

export const PopularPlantsPage = () => {
    const { plants, loading } = usePopularPlants();

    if (loading) return <p>로딩 중...</p>;

    const top3 = plants.slice(0, 3);
    const rest = plants.slice(3);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">인기 식물</h1>
            <p className="text-gray-500 mb-6">많은 사람들이 좋아하는 식물을 만나보세요.</p>

            <TopThreePlants plants={top3} />

            <hr/>
            <PopularPlantsList plants={rest} />
        </div>
    );
};