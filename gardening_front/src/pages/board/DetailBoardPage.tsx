import {useEffect, useRef, useState} from "react";
import {
    BoardControllerApi,
    BoardLikeControllerApi,
    BoardBookmarkControllerApi,
    type BoardResponseDTO,
} from "@/shared/api";
import BoardDetailHeader from "@/widgets/board/BoardDetailHeader";
import BoardDetailContents from "@/widgets/board/BoardDetailContents";
import BoardDetailComments from "@/widgets/comment/BoardDetailComments.tsx";
import { useParams, useNavigate } from "react-router-dom";
import useUserStore from "@/app/store/userStore";
import ReportModal from "@/widgets/report/ReportModal.tsx";

export default function DetailBoardPage() {
    const { id } = useParams<{ id: string }>();
    const boardId = Number(id);
    const navigate = useNavigate();

    // 게시글 데이터
    const [data, setData] = useState<BoardResponseDTO | null>(null);

    // 로그인 UID
    const loginUid = useUserStore(state => state.uid);

    // 좋아요 & 북마크 상태
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [reportOpen, setReportOpen] = useState(false);
    // 댓글 토글
    const commentRef = useRef<HTMLDivElement | null>(null);
    const [commentOpen, setCommentOpen] = useState(false);

    // 상세 조회
    useEffect(() => {
        const api = new BoardControllerApi();

        api.detail(boardId)
            .then((res) => {
                const dto = res.data;
                setData(dto);
                setLiked(dto.liked ?? false);
                setBookmarked(dto.bookmarked ?? false);
                setLikeCount(dto.likeCount ?? 0);
                setBookmarkCount(dto.bookmarkCount ?? 0);
            })
            .catch((err) => console.error("Error loading detail:", err));
    }, [boardId]);

    if (!data) {
        return (
            <div className="w-full flex justify-center mt-10">
                로딩중...
            </div>
        );
    }

    // 좋아요 토글
    const handleLike = async () => {
        const api = new BoardLikeControllerApi();
        const prev = liked;
        const next = !prev;

        setLiked(next);
        setLikeCount(c => next ? c + 1 : c - 1);

        try {
            if (next) await api.insertLike(boardId);
            else await api.deleteLike(boardId);
        } catch (err) {
            console.error("좋아요 토글 실패:", err);
            setLiked(prev);
            setLikeCount(c => prev ? c + 1 : c - 1);
        }
    };

    // 북마크 토글
    const handleBookmark = async () => {
        const api = new BoardBookmarkControllerApi();
        const prev = bookmarked;
        const next = !prev;

        setBookmarked(next);
        setBookmarkCount(c => next ? c + 1 : c - 1);

        try {
            if (next) await api.insertBookmark(boardId);
            else await api.deleteBookmark(boardId);
        } catch (err) {
            console.error("북마크 토글 실패:", err);
            setBookmarked(prev);
            setBookmarkCount(c => prev ? c + 1 : c - 1);
        }
    };

    // 게시글 삭제
    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            const api = new BoardControllerApi();
            await api.deleteBoard(boardId);

            alert("삭제되었습니다.");
            navigate("/board");
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 댓글 영역으로 스크롤
    const handleToggleComments = () => {
        setCommentOpen((open) => {
            const next = !open;

            // 댓글을 "여는 순간"에만 스크롤
            if (!open) {
                setTimeout(() => {
                    commentRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 50);
            }

            return next;
        });
    };

    return (
        <div className="w-full flex flex-col items-center bg-[#f0f8f1] min-h-screen py-10">
            {/* 헤더 */}
            <BoardDetailHeader data={data} />

            {/* 본문 + 좋아요/북마크/수정/삭제 */}
            <BoardDetailContents
                data={data}
                liked={liked}
                bookmarked={bookmarked}
                likeCount={likeCount}
                bookmarkCount={bookmarkCount}
                onLike={handleLike}
                onBookmark={handleBookmark}
                loginUid={loginUid ?? undefined}
                onEdit={() => navigate(`/board/edit/${boardId}`)}
                onDelete={handleDelete}
                onToggleComments={handleToggleComments}
                commentOpen={commentOpen}
                reportOpen={reportOpen}
                setReportOpen={setReportOpen}
            />
            <ReportModal
                open={reportOpen}
                onClose={() => setReportOpen(false)}
                targetId={boardId}
                targetType="BOARD"   // ★ enum처럼 강제하고 싶다면 여기서 통일
            />
            {/* 댓글 영역 */}
            {commentOpen && (
                <div ref={commentRef} className="w-full flex justify-center mt-2">
                    <div className="w-full max-w-2xl">
                        <BoardDetailComments boardId={boardId} />
                    </div>
                </div>
            )}
        </div>
    );
}
