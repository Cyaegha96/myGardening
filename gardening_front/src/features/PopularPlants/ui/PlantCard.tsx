import {Card, CardContent, CardFooter} from "@/shared/shadcn/components/ui/card.tsx";
import {Badge} from "@/shared/shadcn/components/ui/badge.tsx";

interface PlantCardProps{
    name: string;
    imageUrl: string;
    category: string;
    likes: number;
}

export const PlantCard = ({ name, imageUrl, category, likes }: PlantCardProps) => {
    return (
        <Card className="hover:scale-105 transition-transform duration-200">
            <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-t-lg" />
            <CardContent>
                <h3 className="font-semibold text-lg">{name}</h3>
                <Badge>{category}</Badge>
            </CardContent>
            <CardFooter className="flex justify-between">
                <span>❤️ {likes}</span>
            </CardFooter>
        </Card>
    );
};