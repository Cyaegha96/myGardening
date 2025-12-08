import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlantInfoControllerApi, type PlantInfoDTO } from "@/shared/api";
import { Badge } from "@/shared/shadcn/components/ui/badge";
import { Skeleton } from "@/shared/shadcn/components/ui/skeleton";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

// sprout 애니메이션
import map from "../../../public/assets/lottie/Map-Icon.json";
import sprout from "../../../public/assets/lottie/PlantLoading.json";
import growing from "../../../public/assets/lottie/Flower-growing.json";
import watering from "../../../public/assets/lottie/Watering-Flower.json";
import sun from "../../../public/assets/lottie/Sun.json";
import seeds from "../../../public/assets/lottie/seeds.json";
import pot from "../../../public/assets/lottie/HangingPlant.json";
import propagation from "../../../public/assets/lottie/GrowingSeed.json";
import commonUse from "../../../public/assets/lottie/LivingRoom.json";
import pestTips from "../../../public/assets/lottie/Covid19.json";
import temperature from "../../../public/assets/lottie/Thermometer.json";

export default function PlantDetailPage() {

    const { scientificName } = useParams();
    const [plant, setPlant] = useState<PlantInfoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const api = new PlantInfoControllerApi();
        api.getPlantInfoByScientificName(scientificName!)
            .then(res => {
                setPlant(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch plant detail:", err);
                setLoading(false);
            });
    }, [scientificName]);

    if (loading) {
        return <Skeleton className="w-full h-[420px]" />;
    }

    if (!plant) {
        return <div className="p-6 text-center">데이터를 불러올 수 없습니다.</div>;
    }

    //  Lottie를 각 카드에 적용할 리스트
    const animationList = [
        map,
        growing,
        watering,
        sun,
        seeds,
        propagation,
        sprout,
        pestTips,
        pot,
        temperature,
        commonUse,
    ];

    //  카드 목록 통합
    const cardItems = [
        { title: "원산지", value: plant.origin },
        { title: "자라는 환경", value: plant.environment },
        { title: "물 주는 법", value: plant.watering },
        { title: "빛", value: plant.light },
        { title: "토양", value: plant.soil },
        { title: "번식 방법", value: plant.propagation },
        { title: "비료", value: plant.fertilizer },
        { title: "병충해 관리", value: plant.pestsTips },
        { title: "분갈이", value: plant.potRepot },
        { title: "온도 · 습도", value: plant.temperatureHumidity },
        { title: "활용도", value: plant.commonUses },
    ];

    return (
        <div className="mx-auto h-full max-w-6xl px-4 py-6">

            <div className="relative w-full h-[460px] overflow-hidden rounded-b-2xl">
                <img
                    src={plant.sampleImageUrl}
                    alt={plant.commonName}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

                <motion.div
                    initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="relative z-10 h-full flex flex-col justify-end px-10 pb-12 text-white"
                >
                    {/* TAGS */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {plant.tags?.map(tag => (
                            <Badge
                                key={tag.tagId}
                                className="bg-white/20 backdrop-blur text-white border border-white/30"
                            >
                                {tag.tagName}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
                        {plant.commonName}
                    </h1>

                    <p className="mt-2 text-lg italic tracking-wide text-white/80">
                        {plant.scientificName}
                    </p>
                </motion.div>
            </div>


            <Section title="식물 설명" content={plant.description} />


            <Section title="문화적 의미" content={plant.culturalSignificance} />


            <div className="flex flex-col gap-14 px-6 mt-14 mb-14">
                {cardItems.map((item, i) => (
                    <AlternatingCardSection
                        key={item.title}
                        title={item.title}
                        value={item.value}
                        animation={animationList[i]}
                        reverse={i % 2 === 1}
                    />
                ))}
            </div>
        </div>
    );
}



function Section({ title, content }: { title: string; content?: string }) {
    if (!content) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="px-6 mt-14 max-w-3xl mx-auto"
        >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {content}
            </p>
        </motion.section>
    );
}

function AlternatingCardSection({
                                    title,
                                    value,
                                    animation,
                                    reverse = false
                                }: {
    title: string;
    value?: string;
    animation: any;
    reverse?: boolean;
}) {
    if (!value) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`
                flex items-center gap-8 w-full mt-14 mb-14
                ${reverse ? "flex-row-reverse" : ""}
            `}
        >
            {/* Lottie */}
            <div className="w-1/3 flex justify-center">
                <Lottie animationData={animation} loop className="w-[180px] h-[180px]" />
            </div>

            {/* Card */}
            <div className="flex-1 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-green-700 mb-2">{title}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {value}
                </p>
            </div>
        </motion.div>
    );
}
