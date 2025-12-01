import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/shared/shadcn/components/ui/button";

interface BoardSearchBoxProps {
    onSearch: (keyword: string, type: string) => void;
}

export default function BoardSearchBox({ onSearch }: BoardSearchBoxProps) {
    const [keyword, setKeyword] = useState("");
    const [searchType, setSearchType] = useState("all");

    return (
        <div className="flex items-center gap-2 w-full md:w-auto">

            {/* 검색 범위 선택 */}
            <select
                className="border bg-white px-2.5 py-1.5 rounded-md shadow-sm text-sm"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
                <option value="all">작성자+내용</option>
                <option value="writer">작성자</option>
                <option value="content">내용</option>
                <option value="tag">태그</option>
            </select>

            {/* 검색창 */}
            <div className="flex items-center border rounded-md px-2 py-1.5 bg-white shadow-sm flex-1">
                <Search className="text-gray-400 mr-1.5" size={16} />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSearch(keyword, searchType)
                    }}
                    placeholder="검색..."
                    className="w-full outline-none text-sm"
                />
            </div>

            {/* 버튼 */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => onSearch(keyword, searchType)}
                className="aspect-square rounded-md"
            >
                검색
            </Button>
        </div>
    );
}