import type {TerrariumLayerDTO} from "@/shared/api";
import type {TerrariumObject} from "@/entities/terrarium/object/model/types.ts";

export const layerToCanvas = (layer: TerrariumLayerDTO): TerrariumObject =>{
    return{
        id: String(layer.id ?? crypto.randomUUID()),

        // DB에서 layerType이 올바르게 들어온다고 가정. 없으면 image로 처리
        type: (layer.layerType as any) ?? "image",

        // 이미지 URL (없으면 undefined 허용 타입이면 undefined 사용, 아니면 빈 문자열)
        url: layer.url ?? undefined,

        // 위치/사이즈: undefined이면 안전한 기본값 사용
        x: layer.x ?? 0,
        y: layer.y ?? 0,
        width: layer.width ?? 100,
        height: layer.height ?? 100,

        // 트랜스폼값
        rotation: layer.rotation ?? 0,
        zIndex: layer.zindex ?? 0,

        // 이미지 메타(선택적)
        oriName: (layer as any).oriName ?? undefined,
        sysName: (layer as any).sysName ?? undefined,
    }as TerrariumObject;

};