export interface Plant {
    id: string;
    name: string;
    imageUrl: string;
    likes: number;
    tags?: any[];
}

export interface TopThreeProps {
    plants: Plant[];
}

export interface PlantRowProps {
    rank: number;
    plant: Plant;
}

export interface PopularPlantsListProps {
    plants: Plant[];
}