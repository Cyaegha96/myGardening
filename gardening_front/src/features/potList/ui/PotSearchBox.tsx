import {Search} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button";
import {usePotListStore} from "@/entities/potList/model/potListStore.ts";

export default function PotSearchBox() {

    const keyword = usePotListStore(state => state.keyword);
    const setKeyword = usePotListStore(state => state.setKeyword);

    const searchType = usePotListStore(state => state.searchType);
    const setSearchType = usePotListStore(state => state.setSearchType);

    const fetchPotList = usePotListStore(state => state.fetchPotList);

    return (
        <div className="flex items-center gap-2 w-full md:w-auto">

            {/* 검색 범위 선택 */}
            <select
                className="border bg-white px-2.5 py-1.5 rounded-md shadow-sm text-sm"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
                <option value="all">작성자+제목+내용</option>
                <option value="writer">작성자</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
            </select>

            {/* 검색창 */}
            <div className="flex items-center border rounded-md px-2 py-1.5 bg-white shadow-sm flex-1">
                <Search className="text-gray-400 mr-1.5" size={16}/>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") fetchPotList(true)
                    }}
                    placeholder="검색..."
                    className="w-full outline-none text-sm"
                />
            </div>

            {/* 버튼 */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => fetchPotList(true)}
                className="aspect-square rounded-md"
            >
                검색
            </Button>
        </div>
    );
}