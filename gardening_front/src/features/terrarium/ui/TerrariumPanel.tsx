import {ScrollArea} from "@/shared/shadcn/components/ui/scroll-area.tsx";
import {Card, CardContent} from "@/shared/shadcn/components/ui/card.tsx";
import {usePanelStore} from "@/features/terrarium/model/usePanelStore.ts";

export function TerrariumPanel() {
    const { isOpen, panelType, items } = usePanelStore();

    if (!isOpen) return null;

    return (
        <div className="w-64 h-full border-l flex flex-col">
            {/* 헤더 */}
            <div className="p-3 border-b">
                <h2 className="text-lg font-semibold">
                    {panelType === "images" && "이미지"}
                    {panelType === "myDesigns" && "내 디자인"}
                    {panelType === "icons" && "아이콘"}
                </h2>
            </div>

            {/* ScrollArea 안에 카드 리스트 */}
            <ScrollArea className="flex-1 h-full p-3">
                <div className="flex flex-col gap-3">
                    {items.map((item) => (
                        <Card key={item.id} className="cursor-pointer">
                            <CardContent className="p-1">
                                <img
                                    src={item.url}
                                    alt={item.name || ""}
                                    className="w-full h-auto rounded-md"
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData("image/url", item.url);
                                        e.dataTransfer.setData("image/sysName", item.sysName || "");
                                        e.dataTransfer.setData("image/oriName", item.oriName || "");
                                    }}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}