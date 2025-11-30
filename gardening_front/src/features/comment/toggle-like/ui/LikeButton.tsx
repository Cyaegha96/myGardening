import { Heart } from "lucide-react";
import NumberFlow from "@number-flow/react";
import clsx from "clsx";

export function LikeButton({
                               liked,
                               likeCount,
                               onToggle,
                           }: {
    liked: boolean;
    likeCount: number;
    onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className={clsx(
                "group flex items-center gap-1 text-sm transition-colors hover:text-pink-500",
                liked && "text-pink-500"
            )}
        >
            <Heart
                absoluteStrokeWidth
                className={clsx(
                    "~size-4 transition-transform group-active:scale-75",
                    liked && "fill-current"
                )}
            />
            <NumberFlow animated value={likeCount} />
        </button>
    );
}