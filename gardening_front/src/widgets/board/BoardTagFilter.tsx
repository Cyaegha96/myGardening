import type {BoardTagFilterProps} from "@/entities/board/model/BoardTagFilterProps.ts";

export default function BoardTagFilter({ tagParents, onParentSelect }: BoardTagFilterProps) {

    return (
        <select
            className="border bg-white px-2.5 py-1.5 rounded-md shadow-sm text-sm w-full md:w-64"
            onChange={(e) => onParentSelect(Number(e.target.value))}
        >
            <option value="">태그 분류 선택</option>
            {tagParents.map(p => (
                <option key={p.tagId} value={p.tagId}>
                    {p.description}
                </option>
            ))}
        </select>
    );
}