import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ComposerInput } from "@/features/board/ui/composer-input";
import { toast } from "sonner";
import {
    BoardControllerApi,
    type BoardRequestDTO,
    type BoardResponseDTO
} from "@/shared/api";

export default function WriteBoardPage() {
    const { id } = useParams<{ id: string }>(); // edit 모드일 때만 존재
    const boardId = id ? Number(id) : null;

    const navigate = useNavigate();

    // 수정 모드 여부 판단
    const isEditMode = Boolean(boardId);

    // 수정 모드 시 기존 글 데이터를 불러오기 위한 state
    const [data, setData] = useState<BoardResponseDTO | null>(null);

    // 수정 모드면 기존 글 로딩
    useEffect(() => {
        if (!isEditMode) return;

        const api = new BoardControllerApi();
        api.detail(boardId!)
            .then((res) => setData(res.data))
            .catch((err) => {
                console.error("수정 글 불러오기 실패:", err);
                toast.error("게시글 정보를 가져오지 못했습니다.");
                navigate("/board");
            });
    }, [isEditMode, boardId, navigate]);

    // 등록 핸들러 (Create)
    const handleInsert = async (data: {
        boardInfo: BoardRequestDTO;
        files: File[];
    }) => {
        const api = new BoardControllerApi();

        try {
            await api.insert(data.boardInfo, data.files);

            toast.success("게시글이 등록되었습니다.");
            navigate("/board"); // 목록으로 이동
        } catch (error) {
            console.error("게시글 등록 실패:", error);
            toast.error("등록 중 문제가 발생했습니다.");
        }
    };

    // 수정 핸들러 (Edit)
    const handleUpdate = async (data: {
        boardInfo: BoardRequestDTO;
        files: File[];
    }) => {
        const api = new BoardControllerApi();

        try {
            await api.updateBoard(data.boardInfo, data.files);

            toast.success("게시글이 수정되었습니다.");
            navigate(`/board/${boardId}`); // 상세보기로 이동
        } catch (error) {
            console.error("게시글 수정 실패:", error);
            toast.error("수정 중 문제가 발생했습니다.");
        }
    };

    // edit 모드인데 데이터 아직 안불러온 상태
    if (isEditMode && !data) {
        return <div className="text-center mt-10">불러오는 중...</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? "게시글 수정 🌿" : "글 남기기 🌿"}
            </h2>

            <ComposerInput
                onSend={isEditMode ? handleUpdate : handleInsert} // 모드에 따라 동작 변경
                initialTitle={isEditMode ? data?.title : undefined}
                initialContents={isEditMode ? data?.contents : undefined}
                initialTags={isEditMode ? data?.tags ?? [] : undefined}
                initialImages={
                    isEditMode
                        ? data?.files
                            ?.filter(f => f.id !== undefined && f.url !== undefined)
                            ?.map(f => ({
                                id: f.id!,
                                url: f.url!,
                            }))
                        : undefined
                }
                boardId={boardId ?? undefined}
            />
        </div>
    );
}