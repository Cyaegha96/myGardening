import {Card, CardContent} from "@/shared/shadcn/components/ui/card.tsx";
import type {TopThreeProps} from "@/entities/PopularPlants/model/types.ts";

export const TopThreePlants = ({ plants }:TopThreeProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {plants.map((plant, index) => (
                <Card key={plant.id} className="shadow-lg hover:scale-105 transition">
                    <img
                        src={plant.imageUrl}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardContent className="pt-4">
                        <p className="text-sm text-gray-500 font-medium">
                            {index + 1}등
                        </p>
                        <h3 className="text-lg font-semibold">{plant.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">등록된 수 :  {plant.likes}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};