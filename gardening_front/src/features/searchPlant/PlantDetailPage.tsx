import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlantInfoControllerApi, type PlantInfoDTO } from "@/shared/api";
import { Badge } from "@/shared/shadcn/components/ui/badge";
import { Skeleton } from "@/shared/shadcn/components/ui/skeleton";
import { motion } from "framer-motion";

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

    return (
        <div className="w-full">

            {/* 🌟 HERO SECTION */}
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

            {/* 🌱 SECTION: DESCRIPTION */}
            <Section title="식물 설명" content={plant.description} />

            {/* 🌱 CULTURAL */}
            <Section title="문화적 의미" content={plant.culturalSignificance} />

            {/* 🌱 SECTION CARDS (환경, 빛, 물주기 등) */}
            <div className="w-full mt-14 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <CardSection title="원산지" value={plant.origin} />
                <CardSection title="자라는 환경" value={plant.environment} />
                <CardSection title="물 주는 법" value={plant.watering} />
                <CardSection title="빛" value={plant.light} />
                <CardSection title="토양" value={plant.soil} />
                <CardSection title="번식 방법" value={plant.propagation} />
                <CardSection title="비료" value={plant.fertilizer} />
                <CardSection title="병충해 관리" value={plant.pestsTips} />
                <CardSection title="분갈이" value={plant.potRepot} />
                <CardSection title="온도 · 습도" value={plant.temperatureHumidity} />
                <CardSection title="활용도" value={plant.commonUses} />
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


function CardSection({ title, value }: { title: string; value?: string }) {
    if (!value) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
        >
            <h3 className="text-xl font-semibold text-green-700 mb-2">{title}</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {value}
            </p>
        </motion.div>
    );
}
