import { ScrollArea } from "@/shared/shadcn/components/ui/scroll-area";
import { Card } from "@/shared/shadcn/components/ui/card";
import { Button } from "@/shared/shadcn/components/ui/button";
import { useCanvasStore } from "@/features/terrarium/model/useCanvasStore";

export function LayersPanel() {
    const { objects, selectedId, setSelectedId, moveForward, moveBackward, deleteObject } = useCanvasStore();

    return (
        <Card className="w-82 h-full flex flex-col">
            <div className="p-3 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">레이어</h2>
                {selectedId && (
                    <Button size="sm" variant="destructive" onClick={() => deleteObject(selectedId)}>
                        삭제
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1 p-2">
                <div className="flex flex-col gap-2">
                    {objects.map((obj) => (
                        <Card
                            key={obj.id}
                            className={`p-2 cursor-pointer flex items-center justify-between
                                ${selectedId === obj.id ? "bg-blue-100 font-semibold" : ""}
                            `}
                            onClick={() => setSelectedId(obj.id)}
                        >
                            <span>{obj.id}</span>
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                <Button size="icon" onClick={() => moveForward(obj.id)}>▼</Button>
                                <Button size="icon" onClick={() => moveBackward(obj.id)}>▲</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}