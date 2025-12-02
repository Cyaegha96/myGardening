import type {BoardRequestDTO} from "@/shared/api";

export interface ComposerProps {
    onSend: (data: {
        boardInfo: BoardRequestDTO
        files: File[]
    }) => void | Promise<void>

    // 수정모드 (기존 글 불러와서 세팅용)
    initialTitle?: string
    initialContents?: string
    initialTags?: string[]
    initialImages?: { url: string; id: number }[] // 기존 첨부파일
    boardId?: number;
}