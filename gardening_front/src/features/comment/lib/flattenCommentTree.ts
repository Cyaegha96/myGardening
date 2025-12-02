import type { BoardCommentResponseDTO } from "@/shared/api";

export function flattenCommentTree(children: BoardCommentResponseDTO[]) {
    const result: BoardCommentResponseDTO[] = [];

    function traverse(list: BoardCommentResponseDTO[]) {
        for (const item of list) {
            result.push(item);
            if (item.children && item.children.length > 0) {
                traverse(item.children);
            }
        }
    }

    traverse(children);
    return result;
}