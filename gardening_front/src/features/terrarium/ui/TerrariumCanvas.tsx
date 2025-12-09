import { Group, Layer, Rect, Stage, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Card, CardContent } from "@/shared/shadcn/components/ui/card";
import { attachTransformer } from "@/features/terrarium/transformObject/ObjectTransformer.tsx";
import { useCanvasStore } from "@/features/terrarium/model/useCanvasStore.ts";
import { handleCanvasDrop } from "@/features/terrarium/drag&drop/handleCanvasDrop.ts";
import { useFitStage } from "@/features/terrarium/fitToContainer/fitStageToContainer.ts";
import { Input } from "@/shared/shadcn/components/ui/input.tsx";
import { Checkbox } from "@/shared/shadcn/components/ui/checkbox.tsx";
import { TerrariumControllerApi } from "@/shared/api";
import { TerrariumSelector } from "@/features/terrarium/ui/TerrariumSelector.tsx";
import { useLoadTerrarium } from "@/features/terrarium/model/useLoadTerrarium.ts";
import { TerrariumImage } from "@/features/terrarium/ui/TerrariumImage.tsx";

export default function TerrariumCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [selectedTerrariumId, setSelectedTerrariumId] = useState<number | null>(null);
    const [terrariums, setTerrariums] = useState<{ id: number; title: string }[]>([]);

    const { objects, selectedId, setSelectedId, addObject, saveCanvas, setObjects } = useCanvasStore();
    const size = useFitStage(containerRef);
    const terrariumApi = new TerrariumControllerApi();
    const { loadTerrarium } = useLoadTerrarium();

    // Transformer 연결
    useEffect(() => {
        if (!selectedId) {
            transformerRef.current?.nodes([]);
            transformerRef.current?.getLayer()?.batchDraw();
            return;
        }
        attachTransformer(transformerRef, stageRef, selectedId);
    }, [selectedId, objects]);

    // 테라리움 리스트 로드
    const loadTerrariums = async () => {
        const res = await terrariumApi.getAllTerrariums(
            selectedTerrariumId ?? undefined
        );

        const mapped = res.data.map((t: any) => ({
            id: t.id,
            title: t.title,
        }));
        setTerrariums(mapped);
    };
    useEffect(() => {
        loadTerrariums();
    }, []);

    // 테라리움 삭제
    const handleDeleteTerrarium = async (id: number) => {
        try {
            await terrariumApi.deleteTerrarium(id);
            setSelectedTerrariumId(null);
            loadTerrariums(); // 삭제 후 리스트 갱신
            setObjects([]); // 삭제 후 캔버스 초기화
        } catch (err) {
            console.error("삭제 실패:", err);
        }
    };

    return (
        <Card className="w-full h-full p-2 flex flex-col">
            <CardContent className="flex gap-2 mb-2">
                <Input placeholder="테라리움 제목" value={title} onChange={e => setTitle(e.target.value)} />
                <Input placeholder="설명" value={description} onChange={e => setDescription(e.target.value)} />
                <div className="flex items-center gap-2">
                    <Checkbox checked={isPublic} onCheckedChange={checked => setIsPublic(Boolean(checked))} />
                    <span>공개</span>
                </div>
                <Button
                    onClick={async () => {
                        const terrarium = await terrariumApi.createTerrarium({
                            title,
                            description,
                            isPublic,
                            width: size.width,
                            height: size.height,
                        });
                        alert("저장완료!");
                        const terrariumId = terrarium.data.id as number;
                        await saveCanvas(terrariumId);
                        loadTerrariums();
                    }}
                >
                    저장
                </Button>
            </CardContent>

            {/* 테라리움 선택 + 삭제 버튼 */}
            <div className="flex items-center gap-2 mb-2">
                <TerrariumSelector
                    terrariums={terrariums}
                    onSelect={id => setSelectedTerrariumId(id)}
                />
                {selectedTerrariumId && (
                    <Button
                        variant="destructive"
                        onClick={() => handleDeleteTerrarium(selectedTerrariumId)}
                    >
                        삭제
                    </Button>
                )}
                <Button
                    variant="secondary"
                    onClick={async () => {
                        if (selectedTerrariumId) await loadTerrarium(selectedTerrariumId);
                    }}
                >
                    불러오기
                </Button>
            </div>

            {/* 캔버스 영역 */}
            <div
                ref={containerRef}
                className="flex-1 border rounded-md overflow-hidden relative"
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleCanvasDrop(e, stageRef, addObject)}
            >
                <Stage
                    width={size.width}
                    height={size.height}
                    ref={stageRef}
                    onMouseDown={e => {
                        if (e.target === stageRef.current) setSelectedId(null);
                    }}
                >
                    <Layer>
                        <Rect x={0} y={0} width={size.width} height={size.height} fill="#f8fafc" />
                    </Layer>
                    <Layer>
                        {objects.map(o => (
                            <Group
                                key={o.id}
                                id={o.id}
                                x={o.x}
                                y={o.y}
                                rotation={o.rotation}
                                draggable
                                onClick={() => setSelectedId(o.id)}
                                onDragEnd={e => {
                                    const node = e.currentTarget;
                                    setObjects(objects.map(obj => obj.id === o.id ? { ...obj, x: node.x(), y: node.y() } : obj));
                                }}
                                onTransformEnd={e => {
                                    const node = e.currentTarget;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();

                                    setObjects(objects.map(obj => obj.id === o.id ? {
                                        ...obj,
                                        x: node.x(),
                                        y: node.y(),
                                        width: Math.max(5, obj.width * scaleX),
                                        height: Math.max(5, obj.height * scaleY),
                                        rotation: node.rotation(),
                                    } : obj));

                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                            >
                                {o.type === "image" ? (
                                    <TerrariumImage url={o.url!} width={o.width} height={o.height} />
                                ) : (
                                    <Rect width={o.width} height={o.height} fill={o.fill} cornerRadius={6} />
                                )}
                            </Group>
                        ))}
                        <Transformer ref={transformerRef} keepRatio={true} />
                    </Layer>
                </Stage>
            </div>
            <Button
                onClick={() => {
                    if (stageRef.current) {
                        // 1. 캔버스를 이미지 데이터 URL로 변환
                        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
                        // pixelRatio를 높이면 해상도가 더 선명해집니다.

                        // 2. 다운로드 링크 생성
                        const link = document.createElement("a");
                        link.download = `${title || "terrarium"}.png`; // 파일명
                        link.href = uri;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }}
            >
                이미지 다운로드
            </Button>
        </Card>
    );
}