import { type PlantDetail } from '@/entities/searchPlant/searchPlantStore.ts';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card';
import { Button } from '@/shared/shadcn/components/ui/button';
import { Badge } from '@/shared/shadcn/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/shadcn/components/ui/accordion';
import { Loader2, Leaf, XCircle, Info, Sun, Thermometer, Droplet, Layers, Zap, Flower } from 'lucide-react';
import Lottie from "lottie-react";
import sprout from "../../../public/assets/lottie/PlantLoading.json";
import {TypingAnimation} from "@/shared/shadcn/components/ui/typing-animation.tsx";
import {badgeColors} from "@/shared/utils/badgeColors.ts";
import React from "react";

interface Props {
    filePreview?: string;
    files?: File[];
    analysisResult?: PlantDetail | null;
    isUploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFiles: (files: FileList | null) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleRemoveFile: () => void;
    handleUploadClick: () => void;
    handleMyPlantClick: () => void;
}



export function SproutLottieLoader({ text = '서버 분석 중...' }) {


    return (
        <div className="flex flex-col items-center justify-center">
            {/* Lottie 애니메이션 */}
            <Lottie animationData={sprout} loop className="w-32 h-32" />

            {/* 안내 문구 */}
            <p className="text-sm text-muted-foreground mt-2">{text}</p>
        </div>
    );
}

export const PlantDetailDisplay = ({ detail }: { detail: PlantDetail }) => (



    <div className="mt-8 pt-4 border-t border-green-200 dark:border-green-800 w-full">
        <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">
            🌸 식물 분석 결과: {detail.commonName}
        </h3>
        {detail.sampleImageUrl &&
            <img
                className="w-full pt-2"
                src={detail.sampleImageUrl}
                alt="Sample Image"
            />
        }

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 italic">
            (학명: *{detail.scientificName}*, {detail.family})
        </p>
        <div className="flex flex-wrap gap-2">
            {detail.tags &&
                detail.tags.map((tag, index) => (
                    <Badge
                        key={tag.tagId}
                        className={badgeColors[index % badgeColors.length]} // 색상 배열에서 순환
                    >
                        {tag.tagName}
                    </Badge>
                ))}
        </div>

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger><Info className="mr-2 h-4 w-4 text-green-500" />기본 정보 및 특징</AccordionTrigger>
                <AccordionContent className="space-y-2">
                    <TypingAnimation
                        words={[
                            `원산지: ${detail.origin}\n\n환경 적응: ${detail.environment}\n\n특징: ${detail.description}`
                        ]}
                        typeSpeed={50}
                        deleteSpeed={50}
                        loop={false}
                        className="whitespace-pre-line"

                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger><Sun className="mr-2 h-4 w-4 text-amber-500" />광량</AccordionTrigger>
                <AccordionContent>
                    <TypingAnimation
                        words={[detail.light]}
                        typeSpeed={50}
                        deleteSpeed={50}
                        loop={false}
                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger><Thermometer className="mr-2 h-4 w-4 text-red-500" />온도/습도</AccordionTrigger>
                <AccordionContent>
                    <TypingAnimation
                        words={[detail.temperatureHumidity]}
                        typeSpeed={50}
                        deleteSpeed={50}
                        loop={false}
                        className="whitespace-pre-line"

                    />
                    </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger><Droplet className="mr-2 h-4 w-4 text-blue-500" />물주기</AccordionTrigger>
                <AccordionContent><TypingAnimation
                    words={[detail.watering]}
                    typeSpeed={50}
                    deleteSpeed={50}
                    loop={false}
                    className="whitespace-pre-line"

                /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger><Layers className="mr-2 h-4 w-4 text-yellow-800" />토양/비료</AccordionTrigger>
                <AccordionContent className="space-y-2">

                    <TypingAnimation
                        words={[
                            `토양: ${detail.soil}\n\n비료: ${detail.fertilizer}`
                        ]}
                        typeSpeed={50}
                        deleteSpeed={50}
                        loop={false}
                        className="whitespace-pre-line"

                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
                <AccordionTrigger><Zap className="mr-2 h-4 w-4 text-purple-600" />번식/관리</AccordionTrigger>
                <AccordionContent className="space-y-2">

                    <TypingAnimation
                        words={[
                            `분갈이: ${detail.potRepot}\n\n번식: ${detail.propagation} \n\n병충해/팁: ${detail.pestsTips}\n\n용도: ${detail.commonUses}`
                        ]}
                        typeSpeed={50}
                        deleteSpeed={50}
                        loop={false}
                        className="whitespace-pre-line"

                    />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
                <AccordionTrigger><Flower  className="mr-2 h-4 w-4 text-pink-300" />용도와 문화적 의미</AccordionTrigger>
                <AccordionContent className="space-y-2">
                    <TypingAnimation
                        words={[
                            `용도: ${detail.commonUses} \n\n 문화:${detail.culturalSignificance}`
                        ]}
                        typeSpeed={50}
                        deleteSpeed={50}
                        loop={false}
                        className="whitespace-pre-line"

                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
);

export const SearchPlantView = ({
                                    files, filePreview, analysisResult, isUploading,
                                    fileInputRef, handleFiles, handleDrop, handleRemoveFile, handleUploadClick,
                                    handleMyPlantClick
                                }: Props) => {

    return (
        <Card className="w-full max-w-xl mx-auto p-6 shadow-xl rounded-xl border-2 border-green-300 bg-green-50/20 dark:bg-green-950/30">
            <CardContent className="flex flex-col items-center gap-3 justify-center p-0">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">🌿 식물 사진 분석기</h2>

                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); }}
                    className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all"
                >
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                    {filePreview ? (
                        <div className="relative h-full w-full rounded-md overflow-hidden">
                            <img src={filePreview} alt="Preview" className="absolute top-0 left-0 h-full w-full object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 rounded-full" onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}>
                                <XCircle className="h-5 w-5" />
                            </Button>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-sm">
                                {files?.[0]?.name}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <Leaf className="w-12 h-12 text-green-500 mb-3" />
                            <p className="text-lg font-semibold mb-1">여기에 식물 사진을 드롭</p>
                            <p className="text-sm">또는 클릭하여 파일을 선택하세요</p>
                        </div>
                    )}
                </div>
                {!analysisResult && (
                    isUploading ? (
                        <SproutLottieLoader />
                    ) : (
                        <Button
                            onClick={handleUploadClick}
                            className="mt-6 w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
                            disabled={!files || isUploading}
                        >
                            식물 정보 분석 시작
                        </Button>
                    )
                )}

                {/*{(analysisResult &&(     <Button onClick={handleMyPlantClick} className="mt-6 w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white" disabled={!files || isUploading}>*/}
                {/*    {isUploading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />내 식물로 만드는 중...</> : '내 식물로 설정하기'}*/}
                {/*</Button>))}*/}

                {(files || analysisResult) && !isUploading && (
                    <Button variant="outline" onClick={handleRemoveFile} className="mt-3 w-full">
                        {analysisResult ? '새 분석 시작 / 초기화' : '파일 다시 선택'}
                    </Button>
                )}

                {analysisResult && <PlantDetailDisplay detail={analysisResult} />}
                <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-2 shadow-sm">
                    <img
                        src="/assets/plantnet-logo-title.svg"
                        alt="PlantNet Logo"
                        className="h-7 w-auto"

                    />
                    <div className="text-sm text-muted-foreground">
                        식물 검색에 Pl@ntNet API가 활용되었습니다.
                        <a href="https://plantnet.org" target="_blank" className="underline hover:text-foreground">
                            (Pl@ntNet 공식 페이지)
                        </a>
                    </div>

                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-2 shadow-sm">
                    <img src="/assets/Google_Gemini_logo_2025.svg" alt="Gemini Logo" className="h-6" />
                        <div className="text-sm text-muted-foreground">
                          식물 정보 요약 및 설명 생성에는 Google Gemini 모델이 사용되었습니다. 인공지능의 답변 정보는 틀린 부분이 있을 수 있습니다.
                          <a
                              href="https://deepmind.google/technologies/gemini/"
                              target="_blank"
                              className="underline hover:text-foreground ml-1"
                          >
                            (Gemini 정보)
                          </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
