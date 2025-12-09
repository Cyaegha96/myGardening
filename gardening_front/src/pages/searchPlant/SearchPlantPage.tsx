"use client";

import {useState} from "react";
import {SearchPlant} from "@/features/searchPlant/SearchPlant";
import {useSearchPlantStore} from "@/entities/searchPlant/searchPlantStore";

import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/shared/shadcn/components/ui/sheet"
import {Button} from "@/shared/shadcn/components/ui/button"
import {History} from "lucide-react";
import {Badge} from "@/shared/shadcn/components/ui/badge.tsx";

export default function SearchPlantPage() {
    const history = useSearchPlantStore((s) => s.history);
    const loadFromHistory = useSearchPlantStore((s) => s.loadFromHistory);
    const isUploading = useSearchPlantStore((s) => s.isUploading);

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row p-4 md:p-6 gap-4 relative min-h-screen">

            {/* 모바일용 Sheet 토글 버튼 */}
            <div className="md:hidden fixed right-4 top-20 z-50">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <div className="fixed bottom-23 right-6 md:bottom-27 md:right-8 z-50">
                            <Button
                                className="relative bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105">
                                <History className="size-5 md:size-6"/>
                                {history.length > 0 && (
                                    <Badge className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6"
                                           variant="destructive">
                                        {history.length}
                                    </Badge>
                                )}
                            </Button>
                        </div>
                    </SheetTrigger>

                    {/* 📌 모바일: Sheet 슬라이드 */}
                    <SheetContent side="right" className="w-72 z-100">
                        <SheetHeader>
                            <SheetTitle>최근 검색 결과</SheetTitle>
                        </SheetHeader>

                        <div className="mt-4 space-y-2">
                            {history.length === 0 && (
                                <p className="text-sm text-gray-500">검색 기록이 없습니다.</p>
                            )}

                            {history.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-3 p-2 rounded-lg 
                  bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 
                  cursor-pointer transition
                  ${isUploading ? "pointer-events-none opacity-50" : ""}`}
                                    onClick={() => {
                                        if (!isUploading) loadFromHistory(item);
                                        setIsSheetOpen(false); // 📌 모바일은 클릭 시 자동 닫힘
                                    }}
                                >
                                    <img
                                        src={item.filePreview}
                                        className="w-16 h-16 object-cover rounded"
                                        alt={item.plant.commonName}
                                    />
                                    <div className="flex flex-col">
                                        <p className="font-semibold">{item.plant.commonName}</p>
                                        <p className="text-xs italic text-gray-600 dark:text-gray-400">
                                            {item.plant.scientificName}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* 검색 컴포넌트 */}
            <div className="flex-1">
                <SearchPlant/>
            </div>

            {/* 데스크탑 사이드바 */}
            <aside className="hidden md:block w-72 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                <h3 className="font-bold mb-4 text-gray-700 dark:text-gray-300">
                    최근 검색 결과
                </h3>

                {history.length === 0 && (
                    <p className="text-sm text-gray-500">검색 기록이 없습니다.</p>
                )}

                <div className="flex flex-col gap-2">
                    {history.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800
              ${isUploading ? "pointer-events-none opacity-50" : ""}`}
                            onClick={() => !isUploading && loadFromHistory(item)}
                        >
                            <img
                                src={item.filePreview}
                                className="w-16 h-16 object-cover rounded"
                                alt={item.plant.commonName}
                            />
                            <div className="flex flex-col">
                                <p className="font-semibold">{item.plant.commonName}</p>
                                <p className="text-xs italic text-gray-600 dark:text-gray-400">
                                    {item.plant.scientificName}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
