import { useState, useEffect } from "react";

export interface PolaroidCardProps {
    imageUrl: string;
    lines: string[];
    type?: "plant" | "diary";
    variant?: "tape" | "none";
    onClick?: () => void;
    width?: string;
}

export default function PolaroidCard({
                                         imageUrl,
                                         lines,
                                         type = "plant",
                                         variant = "none",
                                         onClick,
                                         width = "300px",
                                     }: PolaroidCardProps) {
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [randomAngle, setRandomAngle] = useState<number>(0);

    useEffect(() => {
        // 테이프 색상 랜덤
        setSelectedColor([
            "rgba(255, 182, 193, 0.7)", // 연분홍
            "rgba(144, 238, 144, 0.7)", // 연초록
            "rgba(173, 216, 230, 0.7)", // 연파랑
            "rgba(255,255,255,0.4)",   // 투명
        ][Math.floor(Math.random() * 4)]);

        // 테이프 기울기 랜덤
        setRandomAngle(Math.random() * 6 - 3);
    }, []); // mount될 때 딱 1번만 실행

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
                padding: "18px 18px 18px", // 변경: 아래 패딩 줄여서 균형 맞춤
                boxSizing: "border-box",
            }}
        >

            {/* 테이프 */}
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

            {/* 이미지 */}
            <div
                className="w-full overflow-hidden bg-white"
                style={{
                    height: "260px",
                    border: "1px solid #f6f6f6",
                }}
            >
                <img src={imageUrl} className="w-full h-full object-cover" alt="" />
            </div>

            {/* 텍스트 위치 정리 */}
            <div className="w-full text-center pt-3">
                {lines.map((line, i) => {
                    const isCommonName = i === 0 && type === "plant";
                    const isNickname = i === 1 && type === "plant";
                    return (
                        <p
                            key={i}
                            className={`
                                whitespace-pre-wrap tracking-wide
                                ${isCommonName
                                ? "text-green-700 text-sm font-semibold"
                                : isNickname
                                    ? "text-gray-700 font-bold text-base"
                                    : "text-[13px] text-[#4a4a4a] leading-[1.4]" // 변경: line-height 줄임
                            }
                            `}
                        >
                            {line}
                        </p>
                    );
                })}
            </div>
        </div>
    );
}
