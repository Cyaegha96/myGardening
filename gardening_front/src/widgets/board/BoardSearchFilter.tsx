import BoardTagFilter from "./BoardTagFilter";
import BoardSearchBox from "./BoardSearchBox";
import type { BoardSearchFilterProps } from "@/entities/board/model/BoardSearchFilterProps";

export default function BoardSearchFilter({
                                              tagParents,
                                              onSearch,
                                              onParentSelect
                                          }: BoardSearchFilterProps) {

    return (
        <div className="w-full mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <BoardTagFilter
                tagParents={tagParents}
                onParentSelect={onParentSelect}
            />

            <BoardSearchBox onSearch={onSearch} />
        </div>
    );
}
