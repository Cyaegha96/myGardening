import {useEffect, useState} from "react";
import {TerrariumControllerApi} from "@/shared/api";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shared/shadcn/components/ui/select.tsx";

interface TerrariumSelectorProps{
    terrariums: { id: number; title: string }[];
    onSelect:(id:number) =>void;
}

export function TerrariumSelector({ onSelect }: TerrariumSelectorProps) {
    const [terrariums, setTerrariums] = useState<{ id: number; title: string }[]>([]);
    const api = new TerrariumControllerApi();

    useEffect(() => {
        api.getMyTerrariums().then(res => {
            const mapped = res.data.map((t: any) => ({
                id: t.id,
                title: t.title,
            }));
            setTerrariums(mapped);
        });
    }, []);

    return (
        <div>
        <Select onValueChange={(value) => onSelect(Number(value))}>
            <SelectTrigger className="w-60">
                <SelectValue placeholder="테라리움 선택" />
            </SelectTrigger>
            <SelectContent>
                {terrariums.map(t => (
                    <SelectItem key={t.id} value={String(t.id)}>
                        {t.title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        </div>
    );
}