"use client"

import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/shared/shadcn/components/ui/carousel.tsx";
import {usePotDetailStore} from "@/entities/potList/model/potDetailStore.tsx";
import {Card, CardContent} from "@/shared/shadcn/components/ui/card.tsx";
import {Dialog, DialogClose, DialogContent} from "@/shared/shadcn/components/ui/dialog.tsx";
import {useEffect, useState} from "react";

export default function PotDetailImageCarousel() {
    const {images} = usePotDetailStore();

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    const handleImageClick = (index: number) => {
        setSelectedIndex(index)
        setModalOpen(true)
    }

    return (
        <>
            <div className="h-full relative">
                <Carousel setApi={setApi} className="w-full h-full">
                    <CarouselContent className="h-full">
                        {images.length > 0 ? (
                            images.map((img, index) => (
                                <CarouselItem key={img.id} className="h-full cursor-pointer">
                                    <Card className="h-full p-0" onClick={() => handleImageClick(index)}>
                                        <CardContent
                                            className="flex aspect-square items-center justify-center p-0 h-full">
                                            <img
                                                src={img.url}
                                                alt={`pot-img-${img.id}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem className="h-full">
                                <Card className="h-full p-0">
                                    <CardContent className="flex aspect-square items-center justify-center p-0 h-full">
                                        이미지가 없습니다.
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        )}
                    </CarouselContent>

                    <CarouselPrevious
                        className="cursor-pointer absolute left-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent border-none shadow-none text-3xl text-primary p-2 rounded-full z-10"/>
                    <CarouselNext
                        className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent border-none shadow-none text-primary p-2 rounded-full z-10"/>

                    {/* indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                            <span
                                key={i}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    i === current ? "bg-primary" : "bg-primary/30"
                                }`}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>

            {/* 전체 이미지 모달 */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent showCloseButton={false} className="p-0 bg-transparent border-none shadow-none flex justify-center items-center w-full max-w-full h-screen z-500">
                    <Carousel setApi={setApi} className="w-full h-full">
                        <CarouselContent className="h-full">
                            {images.map((img) => (
                                <CarouselItem key={img.id} className="h-full">
                                    <img
                                        src={img.url}
                                        alt={`pot-img-${img.id}`}
                                        className="w-full h-full object-contain cursor-pointer"
                                        onClick={() => setModalOpen(false)}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {/* indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        i === current ? "bg-primary" : "bg-primary/30"
                                    }`}
                                />
                            ))}
                        </div>
                        <DialogClose
                            className="absolute top-4 right-4 text-white text-3xl z-20 cursor-pointer">×</DialogClose>
                    </Carousel>
                </DialogContent>
            </Dialog>
        </>
    );
}
