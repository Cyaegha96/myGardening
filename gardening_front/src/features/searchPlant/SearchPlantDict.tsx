import  { useEffect, useState, useMemo } from "react";
import { PlantInfoControllerApi, type PlantInfoDTO } from "@/shared/api";
import type { AxiosResponse } from "axios";
import BotanicalCard from "@/features/searchPlant/BotanicCards.tsx";
import { useDebounce } from "@/shared/hooks/useDebounce";

function generateBotanicalGradient(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `linear-gradient(135deg, hsl(${hue}, 25%, 88%) 0%, hsl(${(hue + 25) % 360}, 20%, 94%) 100%)`;
}

const PlantGrid = ({ className = "", itemsPerPage = 12 }) => {
    const [items, setItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);

    const [sortKey, setSortKey] = useState("none");
    const [filterFamily, setFilterFamily] = useState("");
    const [filterGenus, setFilterGenus] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        const api = new PlantInfoControllerApi();
        api.getAllPlantInfo()
            .then((res: AxiosResponse<PlantInfoDTO[]>) => {
                const mapped = res.data.map((p) => ({
                    commonName: p.commonName || "",
                    scientificName: p.scientificName || "",
                    sampleImageUrl: p.sampleImageUrl || "https://via.placeholder.com/300",
                    gradient: generateBotanicalGradient(p.scientificName ?? "default"),
                    family: p.family,
                    genus: p.genus,
                    origin: p.origin,
                    environment: p.environment,
                    light: p.light,
                    temperatureHumidity: p.temperatureHumidity,
                    watering: p.watering,
                    soil: p.soil,
                    fertilizer: p.fertilizer,
                    potRepot: p.potRepot,
                    propagation: p.propagation,
                    pestsTips: p.pestsTips,
                    commonUses: p.commonUses,
                    culturalSignificance: p.culturalSignificance,
                    description: p.description,
                    tags: p.tags || [],
                }));
                setItems(mapped);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterFamily, filterGenus, selectedTags, sortKey]);

    /** ----------------------------------------
     *   1) FILTER 작업 useMemo
     * ---------------------------------------- */
    const filteredItems = useMemo(() => {
        return items
            .filter((item) => (filterFamily ? item.family === filterFamily : true))
            .filter((item) => (filterGenus ? item.genus === filterGenus : true))
            .filter(item =>
                selectedTags.length > 0
                    ? item.tags?.some(tag => selectedTags.includes(tag.tagName))
                    : true
            )
            .filter(item =>
                debouncedSearch
                    ? (
                        item.commonName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        item.scientificName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        item.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
                    )
                    : true
            );
    }, [items, debouncedSearch, filterFamily, filterGenus, selectedTags]);

    /** ----------------------------------------
     *   2) SORT 작업 useMemo
     * ---------------------------------------- */
    const sortedItems = useMemo(() => {
        if (sortKey === "none") return filteredItems;

        const copy = [...filteredItems];
        if (sortKey === "scientific") {
            return copy.sort((a, b) => a.scientificName.localeCompare(b.scientificName));
        }
        if (sortKey === "common") {
            return copy.sort((a, b) => a.commonName.localeCompare(b.commonName));
        }
        return copy;
    }, [filteredItems, sortKey]);

    /** ----------------------------------------
     *   3) PAGINATION useMemo
     * ---------------------------------------- */
    const currentItems = useMemo(() => {
        const lastIndex = page * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return sortedItems.slice(firstIndex, lastIndex);
    }, [sortedItems, page, itemsPerPage]);

    const totalPages = useMemo(
        () => Math.ceil(sortedItems.length / itemsPerPage),
        [sortedItems, itemsPerPage]
    );

    const unique = (key: string) =>
        Array.from(new Set(items.map((i) => i[key]).filter(Boolean)));

    const uniqueFamilies = unique("family");
    const uniqueGenus = unique("genus");

    const uniqueTags = useMemo(
        () => Array.from(new Set(items.flatMap(i => i.tags?.map(t => t.tagName) ?? []))),
        [items]
    );

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="w-full flex flex-col items-center">

            <div className="w-full p-4 rounded-lg bg-gray-50 mb-6 flex flex-wrap gap-4 items-center justify-between">

                {/* 정렬 */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">정렬:</span>
                    <select
                        className="border rounded px-2 py-1"
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                    >
                        <option value="none">정렬 없음</option>
                        <option value="scientific">학명순</option>
                        <option value="common">이름순</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="식물 검색 (이름, 설명 등)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded px-3 py-1 w-64"
                    />
                </div>

                {/* 필터링 */}
                <div className="flex items-center gap-3 flex-wrap">

                    {/* Family */}
                    <select
                        className="border rounded px-2 py-1"
                        value={filterFamily}
                        onChange={(e) => setFilterFamily(e.target.value)}
                    >
                        <option value="">전체 과(Family)</option>
                        {uniqueFamilies.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>

                    {/* Genus */}
                    <select
                        className="border rounded px-2 py-1"
                        value={filterGenus}
                        onChange={(e) => setFilterGenus(e.target.value)}
                    >
                        <option value="">전체 속(Genus)</option>
                        {uniqueGenus.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>



                    {/* 태그 필터 */}
                    <div className="flex flex-wrap gap-2 items-center mt-2">
                        {uniqueTags.map((tag) => {
                            const isActive = selectedTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`
                    px-2 py-1 rounded text-sm border transition
                    ${isActive
                                        ? "bg-green-600 text-white border-green-700"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
                `}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* 카드 그리드 */}
            <div
                className={`relative w-full min-h-[600px] grid gap-6 
                    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}
            >
                {currentItems.map((c, i) => (
                    <div key={i} className="w-full h-[480px]">
                        <BotanicalCard plant={c} />
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-6 flex gap-3 items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                    이전
                </button>
                <span className="px-2 py-1 text-gray-700">{page} / {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default PlantGrid;
