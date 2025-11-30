export interface CommentInputProps {
    parentId?: number;              // 부모 댓글 ID (없으면 일반 댓글)
    parentNickname?: string;        // 부모 닉네임 (대댓글일 때만 사용)

    // 댓글 등록: 내용 + 부모 ID
    onSubmit: (contents: string, parentId: number) => void;

    // 답글 입력 취소
    onCancel?: () => void;
}