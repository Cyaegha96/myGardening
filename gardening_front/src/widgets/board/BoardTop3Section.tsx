import type { BoardResponseDTO } from "@/shared/api";
import { BoardListCard } from "@/entities/board/ui/BoardListCard";
import { BoardNoImageCard } from "@/entities/board/ui/BoardNoImageCard";

interface BoardTop3SectionProps {
    items: BoardResponseDTO[];
    onClick: (id: number) => void;
}

export default function BoardTop3Section({ items, onClick }: BoardTop3SectionProps) {
    return (
        <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">인기 게시글 Top 3</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {items.map((item) =>
                    item.thumbnail ? (
                        <BoardListCard key={item.id} {...item} onClick={onClick} />
                    ) : (
                        <BoardNoImageCard key={item.id} {...item} onClick={onClick} />
                    )
                )}
            </div>
        </section>
    );
}