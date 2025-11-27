import { useEffect, useState, useRef, useCallback } from "react";
import {
    BoardControllerApi,
    type BoardResponseDTO
} from "@/shared/api";
import { BoardListCard } from "@/entities/board/ui/BoardListCard";
import { BoardNoImageCard } from "@/entities/board/ui/BoardNoImageCard";
import { useNavigate, useLocation } from "react-router-dom";

export default function BoardListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const api = new BoardControllerApi();

    const [top3, setTop3] = useState<BoardResponseDTO[]>([]);
    const [boards, setBoards] = useState<BoardResponseDTO[]>([]);
    const [cursorId, setCursorId] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    /** ⭐ 초기 로딩 — Top3 + 첫 페이지 전체 게시글 */
    useEffect(() => {
        const loadInitial = async () => {
            try {
                // 1) Top3 가져오기
                const top = await api.getTop3List();
                setTop3(top.data);

                // 2) 전체 최신 게시글 9개 (Top3 제거 X)
                const listResp = await api.getList(undefined, 9);
                const list = listResp.data;

                setBoards(list);

                if (list.length > 0) {
                    setCursorId(list[list.length - 1].id);
                }

                setHasMore(list.length >= 9);
            } catch (e) {
                console.error("초기 로딩 실패:", e);
            }
        };

        loadInitial();

    }, [location.pathname]);

    /** ⭐ 추가 페이지 로딩 */
    const loadMore = useCallback(async () => {
        if (!cursorId || loading || !hasMore) return;

        setLoading(true);

        try {
            const resp = await api.getList(cursorId, 9);
            const newItems = resp.data;

            if (newItems.length === 0) {
                setHasMore(false);
            } else {
                setBoards((prev) => [...prev, ...newItems]);
                setCursorId(newItems[newItems.length - 1].id);
            }
        } catch (e) {
            console.error("추가 로딩 실패:", e);
        }

        setLoading(false);
    }, [cursorId, loading, hasMore]);

    /** ⭐ IntersectionObserver */
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loadMore]);

    /** 상세 페이지 이동 */
    const handleCardClick = (id: number) => {
        navigate(`/board/${id}`);
    };

    return (
        <main className="mx-auto h-full w-full max-w-5xl px-4 py-12">

            {/* TOP3 */}
            <h2 className="text-xl font-bold mb-4">인기 게시글 Top 3</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                {top3.map((item) =>
                    item.thumbnail ? (
                        <BoardListCard key={item.id} {...item} onClick={handleCardClick} />
                    ) : (
                        <BoardNoImageCard key={item.id} {...item} onClick={handleCardClick} />
                    )
                )}
            </div>

            <hr/>

            {/* 전체 게시글 */}
            <h2 className="text-xl font-bold mt-4 mb-4">전체 게시글</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                {boards.map((item) =>
                    item.thumbnail ? (
                        <BoardListCard key={item.id} {...item} onClick={handleCardClick} />
                    ) : (
                        <BoardNoImageCard key={item.id} {...item} onClick={handleCardClick} />
                    )
                )}
            </div>

            {/* 로딩 영역 */}
            {hasMore && (
                <div ref={loaderRef} className="h-10 flex justify-center items-center">
                    {loading && <span>로딩 중...</span>}
                </div>
            )}
        </main>
    );
}
