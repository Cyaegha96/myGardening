import React, { useEffect, useState } from "react";
import { PlantInfoControllerApi, type PlantInfoDTO } from "@/shared/api";
import type { AxiosResponse } from "axios";
import {Skeleton} from "@/shared/shadcn/components/ui/skeleton.tsx";
import type {PlantDetail} from "@/entities/searchPlant/searchPlantStore.ts";
import {Badge} from "@/shared/shadcn/components/ui/badge.tsx";
import {badgeColors} from "@/shared/utils/badgeColors.ts";
function generateBotanicalGradient(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `linear-gradient(135deg, hsl(${hue}, 25%, 88%) 0%, hsl(${(hue + 25) % 360}, 20%, 94%) 100%)`;
}

interface BotanicalCardProps {
    plant: PlantDetail & {
        gradient: string;
    };

}

const BotanicalCard: React.FC<BotanicalCardProps> = ({ plant }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [frontLoaded, setFrontLoaded] = useState(false);
    const [backLoaded, setBackLoaded] = useState(false);

    useEffect(() => {
        setFrontLoaded(false);

    }, [plant.sampleImageUrl]);

    return (
        <div
            className="relative w-full h-full group [perspective:2000px] rounded-xl"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className={`relative w-full h-full [transform-style:preserve-3d] transition-all duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}>

                {/* FRONT */}
                <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] overflow-hidden rounded-xl border border-gray-300 shadow-sm`} style={{ background: plant.gradient }}>
                    <div className="w-full h-[320px] p-2 bg-white">
                        {!frontLoaded && <Skeleton className="w-full h-full rounded-lg" />}
                        <img
                            src={plant.sampleImageUrl}
                            alt={plant.commonName}
                            className={`w-full h-full object-cover rounded-lg ${frontLoaded ? "block" : "hidden"}`}
                            onLoad={() => setFrontLoaded(true)}
                        />
                    </div>
                    <footer className="p-4 text-[#2b3a2b]">
                        <h3 className="text-[1.1rem] font-semibold leading-snug">{plant.commonName}</h3>
                        <p className="mt-1 text-[0.9rem] opacity-70 italic">{plant.scientificName }</p>


                        <div className="flex flex-wrap gap-2">
                            {plant.tags &&
                                plant.tags.map((tag, index) => (
                                    <Badge
                                        key={tag.tagId}
                                        className={badgeColors[index % badgeColors.length]} // 색상 배열에서 순환
                                    >
                                        {tag.tagName}
                                    </Badge>
                                ))}
                        </div>
                    </footer>
                </div>

                {/* BACK */}
                <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 rounded-xl border border-gray-300 shadow-sm bg-gradient-to-b from-green-50 to-green-100 flex flex-col justify-start gap-2 text-left overflow-y-auto`}>
                    <h3 className="text-lg font-semibold text-green-800 mb-1">{plant.commonName}</h3>
                    <div className="w-full h-[200px] p-2">
                        {!backLoaded && <Skeleton className="w-full h-full rounded-lg" />}
                        <img
                            src={plant.sampleImageUrl}
                            alt={plant.commonName}
                            className={`w-full h-full object-cover rounded-lg ${backLoaded ? "block" : "hidden"}`}
                            onLoad={() => setBackLoaded(true)}
                        />
                    </div>
                    <p className=" text-sm italic mb-2">학명: {plant.scientificName }</p>
                    {plant.family && <p className=" text-sm">과: {plant.family}</p>}
                    {plant.genus && <p className="text-sm">속: {plant.genus}</p>}
                    {plant.origin && <p className=" text-sm">원산지: {plant.origin}</p>}
                    {plant.environment && <p className=" text-sm">환경: {plant.environment}</p>}
                    {plant.light && <p className=" text-sm">빛: {plant.light}</p>}
                    {plant.temperatureHumidity && <p className="text-sm">온도/습도: {plant.temperatureHumidity}</p>}
                    {plant.watering && <p className=" text-sm">물주기: {plant.watering}</p>}
                    {plant.soil && <p className="text-sm">토양: {plant.soil}</p>}
                    {plant.fertilizer && <p className="text-sm">비료: {plant.fertilizer}</p>}
                    {plant.potRepot && <p className=" text-sm">분갈이: {plant.potRepot}</p>}
                    {plant.propagation && <p className="text-sm">번식: {plant.propagation}</p>}
                    {plant.pestsTips && <p className="text-sm">병충해 관리: {plant.pestsTips}</p>}
                    {plant.commonUses && <p className=" text-sm">용도: {plant.commonUses}</p>}
                    {plant.culturalSignificance && <p className="text-sm">문화적 의미: {plant.culturalSignificance}</p>}
                    {plant.description && <p className=" text-sm">설명: {plant.description}</p>}
                </div>

            </div>
        </div>
    );
};

const ChromaGrid = ({ className = "", itemsPerPage = 12 }) => {
    const [items, setItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);

    // 🔎 정렬 & 필터 상태
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
            .catch((err) => console.error("Failed to fetch:", err));
    }, []);

    // ============================
    // 🔎 필터링 + 정렬 적용
    // ============================
    const filtered = items
        .filter((item) => (filterFamily ? item.family === filterFamily : true))
        .filter((item) => (filterGenus ? item.genus === filterGenus : true))
        .filter(item =>
            selectedTags.length > 0
                ? item.tags?.some(t => selectedTags.includes(t.tagName))
                : true
        )

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)   // 있으면 제거
                : [...prev, tag]                // 없으면 추가
        );
    };

    const sorted = [...filtered].sort((a, b) => {
        if (sortKey === "scientific") {
            return a.scientificName.localeCompare(b.scientificName);
        }
        if (sortKey === "common") {
            return a.commonName.localeCompare(b.commonName);
        }
        return 0;
    });

    const lastIndex = page * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = sorted.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(sorted.length / itemsPerPage);

    // ============================
    // 🔎 필터 옵션용 unique 리스트
    // ============================
    const unique = (key: string) =>
        Array.from(new Set(items.map((i) => i[key]).filter(Boolean)));

    const uniqueFamilies = unique("family");
    const uniqueGenus = unique("genus");

    const uniqueTags = Array.from(
        new Set(items.flatMap((i) => i.tags?.map((t) => t.tagName) ?? []))
    );

    return (
        <div className="w-full flex flex-col items-center">

            {/* 🔥 정렬 + 필터 UI 영역 */}
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



                    {/* 🔥 태그 필터 */}
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


export default ChromaGrid;