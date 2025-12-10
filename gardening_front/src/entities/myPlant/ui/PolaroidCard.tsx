import {useEffect, useState} from "react";
import type {PolaroidCardProps} from "@/entities/myPlant/model/PolaroidCardProps.ts";
import {MoreVertical} from "lucide-react";

export default function PolaroidCard({
                                         imageUrl,
                                         lines,
                                         type = "plant",
                                         variant = "none",
                                         onClick,
                                         onEdit,
                                         onDelete,
                                         width = "300px",
                                     }: PolaroidCardProps) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [randomAngle, setRandomAngle] = useState<number>(0);

    useEffect(() => {
        setSelectedColor([
            "rgba(255, 182, 193, 0.7)",
            "rgba(144, 238, 144, 0.7)",
            "rgba(173, 216, 230, 0.7)",
            "rgba(255,255,255,0.4)",
        ][Math.floor(Math.random() * 4)]);
        setRandomAngle(Math.random() * 6 - 3);
    }, []);

    return (
        <div
            onClick={onClick}
            className="
                bg-white cursor-pointer relative
                shadow-[0_8px_22px_rgba(0,0,0,0.12)]
                rounded-none select-none
                transition-transform duration-300
                hover:scale-[1.015]
                border border-[#e8e8e8]
            "

            style={{
                width,
                height: type === "diary" ? "370px" : "410px",
                padding: type === "diary" ? "16px" : "18px",
                boxSizing: "border-box",
            }}
        >
            {variant === "tape" && (
                <div
                    className="absolute"
                    style={{
                        top: "-14px",
                        left: "50%",
                        transform: `translateX(-50%) rotate(${randomAngle}deg)`,
                        width: "90px",
                        height: "22px",
                        background: selectedColor,
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    }}
                />
            )}

            {/* 이미지 영역 */}
            <div
                className="w-full overflow-hidden bg-white relative"
                style={{
                    height: "260px",
                    border: "1px solid #f6f6f6",
                }}
            >
                <img src={imageUrl} className="w-full h-full object-cover" alt=""/>
            </div>

            {/* 텍스트 + 액션메뉴 */}
            <div
                className={`
                               w-full text-center
                               pt-3
                              ${type === "diary" ? "pt-2 pb-1" : "pt-3 pb-4"}
                            `}
            >

                {lines.map((line, i) => {
                    const isCommonName = i === 0 && type === "plant";
                    const isNickname = i === 1 && type === "plant";

                    return (
                        <div
                            key={i}
                            className="relative flex items-center justify-center"
                        >
                            <p
                                className={`
                                    whitespace-pre-wrap tracking-wide
                                    ${isCommonName
                                    ? "text-green-700 text-sm font-semibold"
                                    : isNickname
                                        ? "text-gray-700 font-bold text-base"
                                        : "text-[13px] text-[#4a4a4a] leading-[1.4]"}
                                `}
                                style={{flex: "1"}}
                            >
                                {line}
                            </p>

                            {/* 여기! commonName 줄 오른쪽 끝에 메뉴 ▷ 정확히 수정 */}
                            {type === "plant" && isCommonName && (onEdit || onDelete) && (
                                <button
                                    className="absolute right-0 px-1 py-1 hover:bg-gray-200 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpen(prev => !prev);
                                    }}
                                >
                                    <MoreVertical size={14} className="text-gray-600"/>
                                </button>
                            )}

                            {menuOpen && isCommonName && (
                                <div
                                    className="absolute right-0 top-5 w-24 bg-white border rounded shadow text-xs z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onEdit?.();
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className="block w-full px-3 py-2 text-left text-red-500 hover:bg-red-50"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            onDelete?.();
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
