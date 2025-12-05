
export function handleCanvasDrop(
    e: React.DragEvent,
    stageRef: React.RefObject<any>,
    addObject: (obj: any) => void
) {
    e.preventDefault();
    const url = e.dataTransfer.getData("image/url");
    const oriName = url.split("/").pop();
    const sysName = `img-${Date.now()}`;
    if (!url) return;

    if (!stageRef.current) return;

    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const x = pointerPos.x;
    const y = pointerPos.y;


    addObject({
        id: `img-${Date.now()}`,
        type: "image",
        url,
        oriName,
        sysName,
        x,
        y,
        width: 250,
        height: 250,
    });
}