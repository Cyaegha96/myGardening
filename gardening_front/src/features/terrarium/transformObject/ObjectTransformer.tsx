export function attachTransformer(transformerRef: any, stageRef: any, targetId: string | null) {
    if (!targetId) return;
    const node = stageRef.current.findOne(`#${targetId}`);
    if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
    }
}