import type { BoardResponseDTO } from "@/shared/api";
import { BoardListCard } from "@/entities/board/ui/BoardListCard";
import { BoardNoImageCard } from "@/entities/board/ui/BoardNoImageCard";

interface BoardListSectionProps {
    items: BoardResponseDTO[];
    onClick: (id: number) => void;
}

export default function BoardListSection({ items, onClick }: BoardListSectionProps) {
    return (
        <section className="mt-6 mb-10">
            <h2 className="text-xl font-bold mb-4">전체 게시글</h2>

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