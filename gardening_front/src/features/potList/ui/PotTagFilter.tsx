import {useEffect, useState} from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shared/shadcn/components/ui/accordion";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox";
import {
    type DistrictDTO,
    LocationControllerApi,
    type NeighborhoodDTO,
    type PlantTagDTO,
    type PlantTagParentDTO,
    type ProvinceDTO
} from "@/shared/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/shared/shadcn/components/ui/dialog.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

interface PotTagFilterProps {
    categories: { parentTag: PlantTagParentDTO; tagList: PlantTagDTO[] }[];
    selected: number[];
    toggle: (id: number) => void;
    setLocation: (provinceName: string, neighborhoodName: string) => void;
    location: string | undefined;
}

export default function PotTagFilter({
                                         categories,
                                         selected,
                                         toggle,
                                         setLocation,
                                         location
                                     }: PotTagFilterProps) {

    const [locations, setLocations] = useState<ProvinceDTO[]>([]);
    const [open, setOpen] = useState(false);

    // 선택한 값
    const [selectedProvince, setSelectedProvince] = useState<ProvinceDTO | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictDTO | null>(null);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDTO | null>(null);

    useEffect(() => {
        const api = new LocationControllerApi();
        api.getAllLocations().then(resp => setLocations(resp.data));
    }, []);

    const handleSelectNeighborhood = (provName: string, nbName: string) => {
        setLocation(provName, nbName);
        setOpen(false);
    };

    return (
        <aside className="p-4 mr-4 md:overflow-auto flex flex-col">

            {/* 지역 */}
            <div className="mb-3 order-2 md:order-1">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild className="w-full relative">
                        <Button variant="default" className="absolute bottom-3 left-1/2 -translate-x-1/2 w-90 md:static md:translate-x-0 md:left-auto md:bottom-auto md:w-full">
                            {location ? location.split("%")[1] : "지역 선택"}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-4xl z-250">
                        <DialogHeader>
                            <DialogTitle>지역 선택</DialogTitle>
                        </DialogHeader>

                        {/* 3 컬럼 영역 */}
                        <div className="grid grid-cols-3 gap-4 h-[400px]">

                            {/* -------- 시/도 컬럼 -------- */}
                            <div className="border rounded-md overflow-y-auto">
                                {locations.map(prov => (
                                    <div
                                        key={prov.code}
                                        className={`px-3 py-2 cursor-pointer hover:bg-accent/50 ${
                                            selectedProvince?.code === prov.code ? "bg-accent" : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedProvince(prov);
                                            setSelectedDistrict(null); // 초기화
                                        }}
                                    >
                                        {prov.name}
                                    </div>
                                ))}
                            </div>

                            {/* -------- 구/군 컬럼 -------- */}
                            <div className="border rounded-md overflow-y-auto">
                                {selectedProvince?.districts?.map(dist => (
                                    <div
                                        key={dist.code}
                                        className={`px-3 py-2 cursor-pointer hover:bg-accent/50 ${
                                            selectedDistrict?.code === dist.code ? "bg-accent" : ""
                                        }`}
                                        onClick={() => setSelectedDistrict(dist)}
                                    >
                                        {dist.name}
                                    </div>
                                ))}
                            </div>

                            {/* -------- 동/읍/면 컬럼 -------- */}
                            <div className="border rounded-md overflow-y-auto">
                                {selectedDistrict?.neighborhoods?.map(nb => (
                                    <div
                                        key={nb.code}
                                        className={`px-3 py-2 cursor-pointer hover:bg-accent/50 ${
                                            selectedNeighborhood?.code === nb.code ? "bg-accent" : ""
                                        }`}
                                        onClick={() => {
                                            handleSelectNeighborhood(selectedProvince!.name!, nb.name!);
                                            setSelectedNeighborhood(nb);
                                        }}
                                    >
                                        {nb.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedProvince(null);
                                setSelectedDistrict(null);
                                setSelectedNeighborhood(null);
                                setLocation("", "");   // 선택한 지역 비우기
                                setOpen(false);
                            }}
                        >
                            초기화
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            {/* 카테고리 */}
            <div className="order-1 md:order-2">
                <h3 className="font-semibold mb-1 mt-1">카테고리</h3>
                <Accordion type="multiple" className="w-full">
                    {categories.map(cat => (
                        <AccordionItem key={cat.parentTag.tagId} value={String(cat.parentTag.tagId)}
                                       className="border-0 mb-1">
                            <AccordionTrigger
                                className="text-left gap-2 cursor-pointer hover:bg-accent/50 rounded-sm hover:no-underline px-1 py-1">
                                {cat.parentTag.description}
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="space-y-2 ps-2">
                                    {cat.tagList.map(tag => (
                                        <label
                                            key={tag.tagId}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded-sm px-1 py-1"
                                        >
                                            <Checkbox
                                                checked={selected.includes(tag.tagId!)}
                                                onCheckedChange={() => toggle(tag.tagId!)}
                                            />
                                            <span>{tag.tagName}</span>
                                        </label>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </aside>
    );
}
