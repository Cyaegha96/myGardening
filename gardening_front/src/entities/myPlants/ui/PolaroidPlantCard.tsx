import type {PolaroidPlantCardProps} from "@/entities/myPlants/model/PolaroidPlantCardProps.ts";

export default function PolaroidPlantCard({
                                              imageUrl,
                                              name,
                                              memoLines,
                                              titleAlign = "center",
                                              onClick
                                          }: PolaroidPlantCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white w-[180px] p-3 pb-6 rounded-md shadow-md cursor-pointer hover:shadow-lg transition shadow-gray-300"
        >
            {/* 이미지 */}
            <img
                src={imageUrl}
                className="w-full h-[160px] object-cover rounded"
                alt="plant"
            />

            {/* 제목 */}
            {name && (
                <div
                    className="mt-3 font-semibold text-sm text-gray-800 whitespace-pre-wrap"
                    style={{textAlign: titleAlign}}
                >
                    {name}
                </div>
            )}

            {/* 메모 */}
            {memoLines.length > 0 && (
                <div className="mt-2 text-[11px] text-gray-600">
                    {memoLines.map((line, idx) => (
                        <div
                            key={idx}
                            className="whitespace-pre-wrap"
                            style={{textAlign: line.align}}
                        >
                            {line.text || " "}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}