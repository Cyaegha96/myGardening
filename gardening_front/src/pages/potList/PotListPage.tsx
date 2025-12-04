import {useEffect, useState} from "react";
import PotTagFilter from "@/features/potList/ui/PotTagFilter.tsx";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";
import PotList from "@/features/potList/ui/PotList.tsx";
import {Button} from "@/shared/shadcn/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/shared/shadcn/components/ui/sheet.tsx";
import {Heart} from "lucide-react";

type Category = { id: number; name: string };

export default function PotListPage() {
    const [categories] = useState<Category[]>([
        {id: 1, name: '채소'},
        {id: 2, name: '화초'},
        {id: 3, name: '과일'},
        {id: 4, name: '잡화'},
    ]);

    const [selectedCats, setSelectedCats] = useState<Set<number>>(new Set());
    const toggleCat = (id: number) => {
        setSelectedCats(prev => {
            const copy = new Set(prev);
            if (copy.has(id)) copy.delete(id);
            else copy.add(id);
            return copy;
        });
    };

    const potLists = usePotListStore(state => state.potLists);
    const fetchPotList = usePotListStore(state => state.fetchPotList);

    const [openTagFilter, setOpenTagFilter] = useState(false);

    useEffect(() => {
        fetchPotList(undefined, undefined, undefined, undefined);
    }, []);

    return (
        <div className="max-w-7xl mx-auto mt-5 px-4">


            {/* 모바일 전용 필터 버튼 */}
            <div className="md:hidden mb-5 flex justify-end">
                <Button variant="outline" onClick={() => setOpenTagFilter(true)}>
                    필터 열기
                </Button>
            </div>

            {/* 데스크탑: grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

                {/* 태그 필터 (모바일에서는 hidden) */}
                <div className="hidden md:block col-span-1">
                    <PotTagFilter
                        categories={categories}
                        selected={selectedCats}
                        toggle={toggleCat}
                    />
                </div>

                {/* 카드 목록 */}
                <section className="col-span-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {potLists.map((item) =>
                            <PotList key={item.id} {...item} />
                        )}
                    </div>
                </section>
            </div>

            <Sheet open={openTagFilter} onOpenChange={setOpenTagFilter}>
                <SheetContent
                    side="right"
                    className="min-w-full md:min-w-1/5 flex flex-col z-150"
                >
                    <SheetHeader>
                        <SheetTitle>
                            찜 한 분양글
                        </SheetTitle>
                    </SheetHeader>

                    {/* 목록 */}
                    <PotTagFilter
                        categories={categories}
                        selected={selectedCats}
                        toggle={toggleCat}
                    />
                </SheetContent>
            </Sheet>
        </div>
    );
}
