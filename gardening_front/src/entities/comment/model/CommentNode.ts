import type { BoardCommentResponseDTO } from "@/shared/api";

export interface CommentNode extends Omit<BoardCommentResponseDTO, "children" | "status"> {
    status: "active" | "delete" | "blocked" | string; // 서버는 string이라 안전하게 string 포함
    children?: CommentNode[];
}