export const categoryMap = {
    rock: "rock",
    soil: "soil",
    tree: "plant",
    case: "glass",
    raptile: "raptile",
} as const;

export type CategoryKey = keyof typeof categoryMap;
export type CategoryValue = typeof categoryMap[CategoryKey];