import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {usePotDetailStore} from "@/entities/potList/model/potDetailStore.ts";
import PotDetailImageCarousel from "@/features/potList/ui/PotDetailImageCarousel.tsx";
import PotDetailInfo from "@/features/potList/ui/PotDetailInfo.tsx";
import PotList from "@/features/potList/ui/PotList.tsx";

export default function PotDetailPage() {
    const {id} = useParams<{ id: string }>();
    const {getDetail, otherPotList, potDetail} = usePotDetailStore();

    useEffect(() => {
        if (id) getDetail(Number(id));
    }, [getDetail, id]);

    return (
        <>
            <div className="max-w-6xl mx-auto mt-5 px-4 flex flex-col md:flex-row gap-6 p-6">
                {/* 이미지 Carousel */}
                <div className="md:w-1/2 w-full">
                    <PotDetailImageCarousel/>
                </div>

                {/* 텍스트 정보 */}
                <div className="md:w-1/2 w-full">
                    <PotDetailInfo/>
                </div>
            </div>

            {otherPotList && otherPotList.length > 1 &&
                <>
                    <hr className="max-w-6xl mx-auto"/>

                    <div className="max-w-6xl mx-auto px-4 mb-5 p-4 md:p-6">
                        <h2 className="text-lg font-semibold mb-3">{potDetail?.writerName ?? "작성자"}의 다른 분양글</h2>

                        <div className="flex gap-4 overflow-x-auto">
                            {otherPotList
                                .filter(pot => pot.id !== Number(id))
                                .map((pot) => (
                                    <div key={pot.id} className="flex-shrink-0 w-48 md:w-64 mb-4">
                                        <PotList {...pot} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </>
            }
        </>
    );
}
