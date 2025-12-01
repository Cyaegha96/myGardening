// BoardActionButtons.tsx
import { Button } from "@/shared/shadcn/components/ui/button";
import type {BoardWriterButtonsProps} from "@/entities/board/model/BoardWriterButtonsProps.ts";

export default function BoardWriterButtons({ onEdit, onDelete }: BoardWriterButtonsProps) {
    return (
        <div className="flex justify-end gap-3">
            <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
            >
                수정
            </Button>

            <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
            >
                삭제
            </Button>
        </div>
    );
}
