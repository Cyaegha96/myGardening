import { BoardCommentControllerApi } from "@/shared/api";

export function useCommentSubmit(boardId: number) {
    const api = new BoardCommentControllerApi();

    const submit = async (text: string, parentId?: number) => {
        await api.insertComment(
            boardId,
            {
                contents: text,
                refCommentId: parentId ?? 0
            }
        );
    };

    return { submit };
}