import { useEffect, useState, useRef, useCallback } from "react";
import {
    BoardControllerApi,
    type BoardResponseDTO,
    PlantTagControllerApi,
    type PlantTagParentDTO
} from "@/shared/api";
import { useNavigate, useLocation } from "react-router-dom";
import BoardSearchFilter from "@/widgets/board/BoardSearchFilter";
import BoardTop3Section from "@/widgets/board/BoardTop3Section";
import BoardListSection from "@/widgets/board/BoardListSection";

export default function BoardListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const api = new BoardControllerApi();

    const [top3, setTop3] = useState<BoardResponseDTO[]>([]);
    const [boards, setBoards] = useState<BoardResponseDTO[]>([]);
    const [cursorId, setCursorId] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 부모 태그 리스트
    const [tagParents, setTagParents] = useState<PlantTagParentDTO[]>([]);

    // 검색 상태
    const [isSearching, setIsSearching] = useState(false);

    // 검색 결과 없음 여부
    const [searchEmpty, setSearchEmpty] = useState(false);

    const firstLoad = useRef(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    // 전체 게시글 + Top3 로딩
    const loadInitialBoards = async () => {
        setLoading(true);
        try {
            const top = await api.getTop3List();
            setTop3(top.data);

            const listResp = await api.getList(undefined, 9);
            const list = listResp.data;

            setBoards(list);

            if (list.length > 0) {
                setCursorId(list[list.length - 1].id);
            }

            setHasMore(list.length >= 9);
            setSearchEmpty(false);
        } finally {
            setLoading(false);
        }
    };

    // 첫 페이지 로딩
    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            setIsSearching(false);
        }
        loadInitialBoards();
    }, [location.pathname]);

    // 무한스크롤 추가 로딩
    const loadMore = useCallback(async () => {
        if (!cursorId || loading || !hasMore || isSearching) return;

        setLoading(true);
        try {
            const resp = await api.getList(cursorId, 9);
            const items = resp.data;

            if (items.length === 0) {
                setHasMore(false);
            } else {
                setBoards(prev => [...prev, ...items]);
                setCursorId(items[items.length - 1].id);
            }
        } finally {
            setLoading(false);
        }
    }, [cursorId, loading, hasMore, isSearching]);

    // IntersectionObserver 설정
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) loadMore();
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loadMore]);

    // 상세 이동
    const handleCardClick = (id: number) => {
        navigate(`/board/${id}`);
    };

    // 일반 검색
    const handleSearch = async (keyword: string, searchType: string) => {
        if (!keyword.trim()) {
            setIsSearching(false);
            await loadInitialBoards();
            return;
        }

        setIsSearching(true);
        setLoading(true);

        try {
            const res = await api.searchBoards(keyword, searchType);
            setBoards(res.data);
            setSearchEmpty(res.data.length === 0);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // 부모 태그 기반 필터링
    const handleFilterParent = async (parentTagId: number) => {
        if (!parentTagId) {
            setIsSearching(false);
            await loadInitialBoards();
            return;
        }

        setIsSearching(true);
        setLoading(true);

        try {
            const res = await api.searchBoardsByTags([String(parentTagId)]);
            setBoards(res.data);
            setSearchEmpty(res.data.length === 0);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // 부모 태그 목록 로딩
    useEffect(() => {
        const api = new PlantTagControllerApi();
        api.getTagParents()
            .then(res => setTagParents(res.data))
            .catch(() => setTagParents([]));
    }, []);

    return (
        <main className="mx-auto h-full w-full max-w-5xl px-4 py-12">

            <BoardSearchFilter
                tagParents={tagParents}
                onSearch={handleSearch}
                onParentSelect={handleFilterParent}
            />

            {!isSearching && (
                <>
                    <BoardTop3Section items={top3} onClick={handleCardClick} />
                    <hr />
                </>
            )}

            {isSearching && searchEmpty ? (
                <div className="py-20 text-center text-gray-500">
                    검색 결과가 없습니다.
                </div>
            ) : (
                <BoardListSection items={boards} onClick={handleCardClick} />
            )}

            {hasMore && !isSearching && (
                <div
                    ref={loaderRef}
                    className="h-10 flex justify-center items-center"
                >
                    ...
                </div>
            )}
        </main>
    );
}
