import {useEffect, useState} from "react";
import {PotListControllerApi, type PotListDetailDTO} from "@/shared/api";
import {useNavigate} from "react-router-dom";


export function PotWidget() {
    const [pots, setPots] = useState<PotListDetailDTO[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPots = async () => {
            try {
                const api = new PotListControllerApi();
                const res = await api.getMyPotList();
                const list = res.data ?? [];
                setPots(list);
            } catch (err) {
                console.error("내 화분 조회 실패:", err);
            }
        };

        fetchPots();
    }, []);


    return (
        <div className="flex flex-col gap-3">
            {pots.slice(0, 3).map((pot) => (
                <div
                    key={pot.id}
                    onClick={() => navigate(`/pot-list/${pot.id}`)}
                    className="border rounded-lg p-3 hover:bg-muted/40 transition"
                >
                    <h3 className="font-medium text-sm">{pot.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {pot.description}
                    </p>
                </div>
            ))}
        </div>
    );
}