import type { PlantDetail } from "@/entities/searchPlant/searchPlantStore";
import React, {useEffect, useRef, useState} from "react";
import { Skeleton } from "@/shared/shadcn/components/ui/skeleton";
import { Badge } from "@/shared/shadcn/components/ui/badge";
import { badgeColors } from "@/shared/utils/badgeColors";
import { useNavigate } from "react-router-dom";
import {Button} from "@/shared/shadcn/stateful-button.tsx";

interface BotanicalCardProps {
    plant: PlantDetail & {
        gradient: string;
    };
}

const ImageWithSkeleton: React.FC<{
    src: string;
    alt: string;
    loaded: boolean;
    onLoad: () => void;
    className?: string;
}> = ({ src, alt, loaded, onLoad, className }) => {

    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current?.complete) {
            onLoad();
        }
    }, []);

    return (
        <div className={className}>
            {!loaded && <Skeleton className="w-full h-full rounded-lg"/>}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover rounded-lg ${loaded ? "block" : "hidden"}`}
                onLoad={onLoad}
            />
        </div>
    );
}

const BotanicalCard: React.FC<BotanicalCardProps> = ({ plant }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoaded(false);  // key가 바뀔 때 완전히 리셋
    }, [plant.scientificName]);

    const handleClick = async () => {

        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate(`/plant-search/dict/${plant.scientificName}`);
    };


    return (
        <div
            className="relative w-full h-[480px] rounded-xl border border-gray-300 shadow-sm flex flex-col overflow-hidden"
            style={{ background: plant.gradient }}
        >
            {/* 이미지 */}
            <ImageWithSkeleton
                src={plant.sampleImageUrl}
                alt={plant.commonName}
                loaded={loaded}
                onLoad={() => setLoaded(true)}
                className="w-full h-[200px] p-2 bg-white min-h-[240px]"
            />

            {/* 카드 내용 */}
            <footer className="p-4 flex-1 flex flex-col text-[#2b3a2b]">
                <h3 className="text-[1.1rem] font-semibold leading-snug">{plant.commonName}</h3>
                <p className="mt-1 text-[0.9rem] opacity-70 italic">{plant.scientificName}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                    {plant.tags?.map((tag, index) => (
                        <Badge
                            key={tag.tagId ?? `${tag.tagName}-${index}`}
                            className={badgeColors[index % badgeColors.length]}
                        >
                            {tag.tagName}
                        </Badge>
                    ))}
                </div>

                {/* 상세 페이지 이동 버튼 */}

                <Button onClick={handleClick} className="mt-auto">
                    상세 보기
                </Button>

            </footer>
        </div>
    );
};

export default BotanicalCard;