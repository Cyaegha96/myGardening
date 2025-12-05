export interface PlantPolaroidCardProps {
    imageUrl: string;
    commonName?: string;
    nickname?: string;
    memoLines: { text: string }[];
    onClick?: () => void;
}
