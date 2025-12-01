import type { BoardResponseDTO } from "@/shared/api";
import { BoardListCard } from "@/entities/board/ui/BoardListCard";
import { BoardNoImageCard } from "@/entities/board/ui/BoardNoImageCard";
import { Button } from "@/shared/shadcn/components/ui/button"; // shared 버튼 사용
import { useNavigate } from "react-router-dom";

interface BoardTop3SectionProps {
    items: BoardResponseDTO[];
    onClick: (id: number) => void;
}

export default function BoardTop3Section({ items, onClick }: BoardTop3SectionProps) {
    const navigate = useNavigate();

    return (
        <section className="mb-12">

            {/* 타이틀 + 작성 버튼 */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">인기 게시글 Top 3</h2>

                <Button
                    onClick={() => navigate("/board/write")}
                    variant="secondary"
                >
                    글 작성
                </Button>
            </div>

            {/* Top3 목록 */}
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