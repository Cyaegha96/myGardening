import clsx from "clsx";
import {Bookmark, Eye, Heart, Megaphone, MessageCircle} from "lucide-react";
import NumberFlow from "@number-flow/react";
import type { ActivityProps } from "@/entities/board/model/ActivityProps";
import { memo } from "react";

function ActivityComponent({
                               viewCount,
                               commentCount,
                               likeCount,
                               bookmarkCount,
                               liked,
                               bookmarked,
                               onLike,
                               onBookmark,
                               onToggleComments,
                               setReportOpen
                           }: ActivityProps) {
    return (
        <div className="w-full flex flex-col select-none text-zinc-600 dark:text-zinc-300">
            <div className="flex w-full items-center py-2">

                {/* 조회수 / 댓글 */}
                <div className="flex flex-1 items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <Eye absoluteStrokeWidth className="~size-4/5" />
                        <NumberFlow animated value={viewCount} />
                    </div>

                    <div
                        className="flex items-center gap-1.5 cursor-pointer"
                        onClick={onToggleComments}
                    >
                        <MessageCircle absoluteStrokeWidth className="~size-4/5" />
                        <NumberFlow animated value={commentCount} />
                    </div>
                </div>



                {/* 좋아요 / 북마크 */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setReportOpen(true)}
                        className="text-red-600 group flex items-center gap-1.5 pr-1.5"
                    ><Megaphone

                        className={clsx(
                            "~size-4/5 transition-transform group-active:scale-[80%]",

                        )}/>
                        신고
                    </button>
                    <button
                        className={clsx(
                            "group flex items-center gap-1.5 pr-1.5 transition-[color] hover:text-pink-500",
                            liked && "text-pink-500"
                        )}
                        onClick={onLike}
                    >
                        <Heart
                            absoluteStrokeWidth
                            className={clsx(
                                "~size-4/5 transition-transform group-active:scale-[80%]",
                                liked && "fill-current"
                            )}
                        />
                        <NumberFlow animated value={likeCount} />
                    </button>

                    <button
                        className={clsx(
                            "group flex items-center gap-1.5 pr-1.5 transition-[color] hover:text-blue-500",
                            bookmarked && "text-blue-500"
                        )}
                        onClick={onBookmark}
                    >
                        <Bookmark
                            absoluteStrokeWidth
                            className={clsx(
                                "~size-4/5 transition-transform group-active:scale-[85%]",
                                bookmarked && "fill-current"
                            )}
                        />
                        <NumberFlow animated value={bookmarkCount} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export const Activity = memo(ActivityComponent);
