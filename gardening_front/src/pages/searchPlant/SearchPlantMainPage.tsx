import { Upload, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/shadcn/components/ui/card";
import { Button } from "@/shared/shadcn/components/ui/button";
import {Link} from 'react-router-dom';
import React, {useState} from "react";
import {Skeleton} from "@/shared/shadcn/components/ui/skeleton.tsx"; // Next.js 환경을 가정하고 Link 컴포넌트 사용

export default function SearchPlantMainPage() {

    const [imageLoading, setImageLoading] = useState(false);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
            <h1 className="text-4xl font-extrabold text-green-700 mb-10">
                 식물 정보 탐색
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">


                <Link to="/plant-search/image" >
                <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-green-200">
                    <CardHeader className="space-y-1">
                        <Upload className="h-8 w-8 text-green-600 mb-2" />
                        <CardTitle className="text-2xl font-bold text-green-800">
                            이미지로 식물 검색
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            {!imageLoading && <Skeleton className="w-full rounded-lg" />}
                            <img src="/assets/searchPlant/searchByImagePlant.png" alt="이미지로 식물 검색"
                            onLoad={()=>setImageLoading(true)}/>
                            이미지를 업로드해서 식물을 검색해보세요. 카메라로 찍은 사진이나 갤러리 이미지를 바로 활용할 수 있습니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                            <Button variant="outline"  className="w-full border-green-600 text-green-500 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg shadow-md">
                                🔍 이미지 검색 시작
                            </Button>

                    </CardContent>
                </Card>
                </Link>
     

               
                <Link to="/plant-search/dict">
                <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-blue-200">
                    <CardHeader className="space-y-1">
                        <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                        <CardTitle className="text-2xl font-bold text-blue-800">
                            식물 사전 검색
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            {!imageLoading && <Skeleton className="w-full rounded-lg" />}
                            <img src="/assets/searchPlant/searchByDictPlant.png" alt="식물 사전 검색"
                                 onLoad={()=>setImageLoading(true)}/>
                            이미 등록된 식물들을 찾아보세요. 이름, 특징 등 키워드를 이용해 방대한 식물 정보를 탐색할 수 있습니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg shadow-md">
                                📖 사전 바로가기
                            </Button>

                    </CardContent>
                </Card>
                </Link>
            </div>
        </div>
    );
}