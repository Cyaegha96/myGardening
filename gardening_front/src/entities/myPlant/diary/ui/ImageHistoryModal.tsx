import { useEffect, useState } from "react";
import { Button } from "@/shared/shadcn/components/ui/button.tsx";
import { MyPlantControllerApi, type MyPlantImageResponseDTO } from "@/shared/api";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
    userPlantId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ImageHistoryModal({ userPlantId, onClose, onSuccess }: Props) {
    const api = new MyPlantControllerApi();
    const [history, setHistory] = useState<MyPlantImageResponseDTO[]>([]);
    const [index, setIndex] = useState(0);

    const loadHistory = async () => {
        const res = await api.getMyPlantImageHistory(userPlantId);
        setHistory(res.data.slice(0, 3)); // ✨ 최대 3장 제한
    };

    const applyImage = async () => {
        await api.applyMyPlantImage(userPlantId, history[index].id);
        onSuccess();
        onClose();
    };

    useEffect(() => {
        loadHistory();
    }, []);

    if (!history.length) {
        return null;
    }

    const current = history[index];

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[#fffdf7] rounded-xl p-6 w-[350px] shadow-xl relative text-center">

                {/* Close */}
                <button className="absolute top-2 right-2" onClick={onClose}>
                    <X size={18} />
                </button>

                {/* Title */}
                <p className="font-semibold text-sm mb-4">대표 이미지 히스토리</p>

                {/* 카드 */}
                <div className="bg-white shadow-xl border rounded-lg p-2 w-60 mx-auto">
                    <img
                        src={current.url}
                        className="w-full h-56 object-cover rounded-md"
                        alt=""
                    />
                    <p className="text-[11px] text-gray-600 mt-2">
                        {current.createdAt?.split("T")[0]}
                    </p>
                </div>

                {/* 네비 */}
                <div className="flex justify-between mt-5">
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={index === 0}
                        onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                    >
                        <ChevronLeft />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={index === history.length - 1}
                        onClick={() =>
                            setIndex((i) => Math.min(i + 1, history.length - 1))
                        }
                    >
                        <ChevronRight />
                    </Button>
                </div>

                {/* 적용 버튼 */}
                <Button className="mt-6 w-full" onClick={applyImage}>
                    이 이미지로 변경 ✨
                </Button>
            </div>
        </div>
    );
}
