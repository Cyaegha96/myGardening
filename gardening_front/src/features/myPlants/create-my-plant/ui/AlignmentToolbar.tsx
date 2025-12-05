import {AlignCenter, AlignLeft, AlignRight} from "lucide-react";
import type {AlignmentToolbarProps} from "@/features/myPlants/create-my-plant/model/AlignmentToolbarProps.ts";


export default function AlignmentToolbar({
                                             currentAlign,
                                             selectedTarget,
                                             onApplyAlign,
                                         }: AlignmentToolbarProps) {
    const disabled = !selectedTarget; // 아무 줄도 선택 안 한 경우 비활성화

    return (
        <div className="flex justify-center mb-4">
            <div className="inline-flex border rounded-md overflow-hidden shadow-sm">
                <button
                    disabled={disabled}
                    onClick={() => onApplyAlign("left")}
                    className={`p-2 border-r ${
                        currentAlign === "left" ? "bg-gray-200" : ""
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                    <AlignLeft size={18}/>
                </button>

                <button
                    disabled={disabled}
                    onClick={() => onApplyAlign("center")}
                    className={`p-2 border-r ${
                        currentAlign === "center" ? "bg-gray-200" : ""
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                    <AlignCenter size={18}/>
                </button>

                <button
                    disabled={disabled}
                    onClick={() => onApplyAlign("right")}
                    className={`p-2 ${
                        currentAlign === "right" ? "bg-gray-200" : ""
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                    <AlignRight size={18}/>
                </button>
            </div>
        </div>
    );
}
