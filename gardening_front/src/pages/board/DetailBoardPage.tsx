import { useEffect, useState } from "react";
import {
    BoardControllerApi,
    BoardLikeControllerApi,
    BoardBookmarkControllerApi,
    type BoardResponseDTO
} from "@/shared/api";
import BoardDetailHeader from "@/entities/board/ui/BoardDetailHeader";
import BoardDetailContents from "@/entities/board/ui/BoardDetailContents";
import { useParams } from "react-router-dom";

export default function DetailBoardPage() {
    const { id } = useParams<{ id: string }>();
    const boardId = Number(id);

    const [data, setData] = useState<BoardResponseDTO | null>(null);

    // 클라이언트 상태
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const [likeCount, setLikeCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);

    const likeAPI = new BoardLikeControllerApi();
    const bookmarkAPI = new BoardBookmarkControllerApi();

    useEffect(() => {
        const board = new BoardControllerApi();

        board.detail(boardId)
            .then((res) => {
                const dto = res.data;

                setData(dto);

                // 서버에서 가져온 실제 값 반영
                setLiked(dto.liked ?? false);
                setBookmarked(dto.bookmarked ?? false);

                setLikeCount(dto.likeCount ?? 0);
                setBookmarkCount(dto.bookmarkCount ?? 0);
            })
            .catch((err) => console.error("Error loading detail:", err));
    }, [boardId]);

    if (!data) {
        return <div className="w-full flex justify-center mt-10">로딩중...</div>;
    }

    // ❤️ 좋아요 토글
    const handleLike = async () => {
        const prev = liked;
        const next = !prev;

        setLiked(next);
        setLikeCount((c) => (next ? c + 1 : c - 1)); // 애니메이션 대상

        try {
            if (next) await likeAPI.insertLike(boardId);
            else await likeAPI.deleteLike(boardId);
        } catch (e) {
            console.error("좋아요 토글 실패:", e);
            setLiked(prev);
            setLikeCount((c) => (prev ? c + 1 : c - 1)); // 롤백
        }
    };

    // ⭐ 북마크 토글
    const handleBookmark = async () => {
        const prev = bookmarked;
        const next = !prev;

        setBookmarked(next);
        setBookmarkCount((c) => (next ? c + 1 : c - 1));

        try {
            if (next) await bookmarkAPI.insertBookmark(boardId);
            else await bookmarkAPI.deleteBookmark(boardId);
        } catch (e) {
            console.error("북마크 토글 실패:", e);
            setBookmarked(prev);
            setBookmarkCount((c) => (prev ? c + 1 : c - 1)); // 롤백
        }
    };

    return (
        <div className="w-full flex flex-col items-center bg-[#f0f8f1] min-h-screen py-10">
            <BoardDetailHeader data={data} />

            <BoardDetailContents
                data={data}
                liked={liked}
                bookmarked={bookmarked}
                likeCount={likeCount}
                bookmarkCount={bookmarkCount}
                onLike={handleLike}
                onBookmark={handleBookmark}
            />
        </div>
    );
}
