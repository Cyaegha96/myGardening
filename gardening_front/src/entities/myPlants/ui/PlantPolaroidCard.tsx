import type { PlantPolaroidCardProps } from "@/entities/myPlants/model/PlantPolaroidCardProps";

export default function PlantPolaroidCard({
                                              imageUrl,
                                              commonName,
                                              nickname,
                                              memoLines,
                                              onClick
                                          }: PlantPolaroidCardProps) {

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg w-40 cursor-pointer hover:scale-105 transition-transform"
        >
            <div className="p-2 flex justify-center">
                <img
                    src={imageUrl}
                    className="object-cover rounded-md h-36 w-full"
                />
            </div>

            {/* 닉네임 */}
            {nickname && (
                <div className="text-center font-semibold text-sm text-gray-700 mt-2">
                    {nickname}
                </div>
            )}

            {/* 메모 최대 3줄 */}
            <div className="text-[10px] px-2 text-gray-600 text-center mt-1 line-clamp-3">
                {memoLines.map(l => l.text).join("\n")}
            </div>

            {commonName && (
                <p className="text-center text-[11px] text-green-700 mt-2 pb-2">
                    {commonName}
                </p>
            )}
        </div>
    );
}
