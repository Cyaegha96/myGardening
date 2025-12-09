import {useEffect, useState} from "react";
import {BoardControllerApi, type BoardResponseDTO} from "@/shared/api";
import {useNavigate} from "react-router-dom";

export function BoardWidget(){
    const [myBoards, setMyBoards] = useState<BoardResponseDTO[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyBoards = async () => {
            try {
                const api = new BoardControllerApi();
                const res = await api.getMyBoardList();
                const list = res.data ?? [];
                setMyBoards(list);
            } catch (err) {
                console.error("내 게시글 조회 실패:", err);
            }
        };

        fetchMyBoards();
    }, []);

    return (
        <div className="flex flex-col gap-3">
            {myBoards.slice(0, 3).map((board) => (
                <div
                    key={board.id}
                    onClick={() => navigate(`/board/${board.id}`)}
                    className="border rounded-lg p-3 hover:bg-muted/40 transition"
                >
                    <h3 className="font-medium text-sm">{board.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {board.contents}
                    </p>
                </div>
            ))}
        </div>
    );
};

