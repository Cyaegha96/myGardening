import {useEffect, useState} from "react";
import type {Plant} from "@/entities/PopularPlants/model/types.ts";
import {type PopularPlantDTO, PopularPlantsControllerApi} from "@/shared/api/api.ts";


export const usePopularPlants = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);

    const popularApi = new PopularPlantsControllerApi();

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const res = await popularApi.getPopularPlants();
                const data = res.data as PopularPlantDTO[];
                const mapped = data.map((dto) => ({
                    id: dto.scientificName ?? "",
                    name: dto.commonName ?? "이름 없음",
                    imageUrl: dto.sampleImageUrl ?? "",
                    likes: dto.count ?? 0,
                    tags: dto.tags ?? [],
                }));

                setPlants(mapped);

            } catch (e) {
                console.error("인기 식물 조회 실패", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, []);

    return { plants, loading };
};