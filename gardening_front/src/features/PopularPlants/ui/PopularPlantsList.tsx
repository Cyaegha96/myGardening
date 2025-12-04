import { PlantRow } from "./PlantRow";
import type { PopularPlantsListProps} from "@/entities/PopularPlants/model/types.ts";

export const PopularPlantsList = ({ plants }:PopularPlantsListProps) => {
    return (
        <div>
            {plants.map((plant, index) => (
                <PlantRow
                    key={plant.id}
                    rank={index + 4}
                    plant={plant}
                />
            ))}
        </div>
    );
};