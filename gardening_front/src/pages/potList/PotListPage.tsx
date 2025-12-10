import {useEffect, useRef, useState} from "react";
import PotTagFilter from "@/features/potList/ui/PotTagFilter.tsx";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import PotList from "@/features/potList/ui/PotList.tsx";
import {Button} from "@/shared/shadcn/components/ui/button";
import {Sheet, SheetContent} from "@/shared/shadcn/components/ui/sheet.tsx";
import PotSearchBox from "@/features/potList/ui/PotSearchBox.tsx";
import {useNavigate} from "react-router-dom";

export default function PotListPage() {
    const potLists = usePotListStore(state => state.potLists);
    const fetchPotList = usePotListStore(state => state.fetchPotList);
    const fetchPotTagList = usePotListStore(state => state.fetchPotTagList);
    const cursorId = usePotListStore(state => state.cursorId);
    const tagFilterList = usePotListStore(state => state.tagFilterList);
    const selectedTags = usePotListStore(state => state.selectedTags);
    const toggleSelectedTags = usePotListStore(state => state.toggleSelectedTags);
    const setLocation = usePotListStore(state => state.setLocation);
    const location = usePotListStore(state => state.location);

    const [openTagFilter, setOpenTagFilter] = useState(false);

    const lastItemRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchPotList();
        fetchPotTagList();
    }, [fetchPotList, fetchPotTagList]);

    useEffect(() => {
        fetchPotList(true);
    }, [fetchPotList, selectedTags, location]);

    /* 마지막 아이템 감지 */
    useEffect(() => {
        if (!lastItemRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (cursorId !== undefined) {
                        fetchPotList();
                    }
                }
            },
            {threshold: 0.5}
        );

        observer.observe(lastItemRef.current);

        return () => observer.disconnect();
    }, [cursorId, fetchPotList]);

    return (
        <div className="max-w-7xl mx-auto mt-5 px-4 mb-5">
            {/* 모바일 전용 필터 버튼 */}
            <div className="md:hidden mb-2 flex justify-end">
                <Button variant="outline" onClick={() => setOpenTagFilter(true)}>
                    필터 열기
                </Button>
            </div>

            {/* 데스크탑: grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

                {/* 태그 필터 (모바일에서는 hidden) */}
                <div className="hidden md:block col-span-1 mt-5">
                    <PotTagFilter
                        categories={tagFilterList}
                        selected={selectedTags}
                        toggle={toggleSelectedTags}
                        setLocation={setLocation}
                        location={location}
                    />
                </div>

                {/* 카드 목록 */}
                <section className="col-span-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-5">
                        <div></div>
                        <div>
                            <PotSearchBox/>
                        </div>
                    </div>

                    <div className="flex justify-end mb-5 mt-3">
                        <div></div>
                        <div>
                            <Button variant="default" onClick={() => navigate("write")}>분양글 작성</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {(potLists != null && potLists.length > 0) ?
                            potLists.map((item) =>
                                <PotList key={item.id} {...item} />
                            )
                            :
                            (
                                <div className="flex justify-center">
                                    검색된 결과가 없습니다.
                                </div>
                            )
                        }
                    </div>

                    {cursorId != null &&
                        <div className="flex justify-center items-center w-full my-5 text-center" ref={lastItemRef}>
                            로딩중...
                        </div>
                    }
                </section>
            </div>

            <Sheet open={openTagFilter} onOpenChange={setOpenTagFilter}>
                <SheetContent
                    side="right"
                    className="min-w-full md:min-w-1/5 flex flex-col z-150 overflow-auto pt-5"
                >
                    {/* 목록 */}
                    <PotTagFilter
                        categories={tagFilterList}
                        selected={selectedTags}
                        toggle={toggleSelectedTags}
                        setLocation={setLocation}
                        location={location}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
}
