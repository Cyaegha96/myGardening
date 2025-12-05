import type {PlantRowProps} from "@/entities/PopularPlants/model/types.ts";

export const PlantRow = ({ rank, plant }:PlantRowProps) => {
    return (
        <div className="flex items-center py-3 border-b last:border-none">
            <div className="text-lg font-bold w-10 text-center text-gray-600">
                {rank}등
            </div>

            <img
                src={plant.imageUrl}
                className="w-14 h-14 object-cover rounded-md mr-4"
            />

            <div className="flex-1">
                <p className="font-medium">{plant.name}</p>
                <p className="text-sm text-gray-400">등록된 수 : {plant.likes}</p>
            </div>
        </div>
    );
};