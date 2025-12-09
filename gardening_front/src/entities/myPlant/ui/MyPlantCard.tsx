import PolaroidCard from "@/entities/myPlant/ui/PolaroidCard";
import MyPlantActionMenu from "@/entities/myPlant/ui/MyPlantActionMenu";
import type {MyPlantCardProps} from "@/entities/myPlant/model/MyPlantCardProps.ts";

export default function MyPlantCard({
                                        plant,
                                        onClick,
                                        onEdit,
                                        onDelete,
                                    }: MyPlantCardProps) {
    const lines = [
        plant.commonName ?? "",
        plant.nickname ?? "",
        ...(plant.memo ? plant.memo.split("\n") : []),
    ];

    return (
        <div className="relative">
            {/* 메뉴 */}
            <div
                className="absolute right-2 top-2 z-20"
                onClick={(e) => e.stopPropagation()}
            >
                <MyPlantActionMenu onEdit={onEdit} onDelete={onDelete} />
            </div>

            {/* 폴라로이드 */}
            <PolaroidCard
                imageUrl={plant.url ?? ""}
                lines={lines}
                type="plant"
                variant="none"
                onClick={onClick}
                width="300px"
            />
        </div>
    );
}
