import {useCanvasStore} from "@/features/terrarium/model/useCanvasStore.ts";
import {layerToCanvas} from "@/features/terrarium/model/converters/layerToCanvas.ts";
import {TerrariumLayerControllerApi} from "@/shared/api/api.ts";

export function useLoadTerrarium() {
    const { setObjects } = useCanvasStore();
    const terrariumLayerApi = new TerrariumLayerControllerApi();

    const loadTerrarium = async (id: number) => {
        console.log("terrariumId:", id, typeof id);

        const res = await terrariumLayerApi.getLayers(id);

        console.log("API 응답:", res.data);
        // 2) TerrariumLayerDTO[] → TerrariumObject[] 로 변환
        const mapped = res.data.map(layerToCanvas);

        setObjects(mapped);
    };

    return { loadTerrarium };
}