import { BoardListCard } from "@/entities/board/ui/BoardListCard";
import { BoardNoImageCard } from "@/entities/board/ui/BoardNoImageCard";
import {useEffect, useState} from "react";
import {BoardControllerApi, type BoardResponseDTO} from "@/shared/api";
import { useNavigate } from "react-router-dom";

export default function BoardListPage() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<BoardResponseDTO[]>([]);

    useEffect(() => {
        // Top3 게시물
        const board = new BoardControllerApi();
        board.getTop3List().then((resp: { data: BoardResponseDTO[] })=> {
            setBoards(resp.data);
        })
    }, []);

    const handleCardClick = (id: number) => {
        navigate(`/board/${id}`);
    };

    return (
        <main className="mx-auto h-full w-full max-w-5xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 p-4">
                <button onClick={() => navigate("write")}>작성</button>
                {boards.map((item) =>
                    item.thumbnail ? (
                        <BoardListCard
                            id={item.id}
                            thumbnail={item.thumbnail}
                            title={item.title}
                            contents={item.contents}
                            writerProfileImage={item.writerProfileImage}
                            writerNickname={item.writerNickname}
                            writerBio={item.writerBio}
                            likeCount={item.likeCount}
                            viewCount={item.viewCount}
                            commentCount={item.commentCount}
                            tags={item.tags}
                            onClick={handleCardClick}
                        />
                    ) : (
                        <BoardNoImageCard
                            id={item.id}
                            title={item.title}
                            contents={item.contents}
                            writerProfileImage={item.writerProfileImage}
                            writerNickname={item.writerNickname}
                            writerBio={item.writerBio}
                            likeCount={item.likeCount}
                            viewCount={item.viewCount}
                            commentCount={item.commentCount}
                            tags={item.tags}
                            onClick={handleCardClick}
                        />
                    )
                )}
            </div>
        </main>
    );
}
