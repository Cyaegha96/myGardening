import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/shadcn/components/ui/dialog";
import { Button } from "@/shared/shadcn/components/ui/button";

export function CommentDeleteModal({
                                       open,
                                       onClose,
                                       onConfirm,
                                   }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>댓글 삭제</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600">
                    정말 삭제하시겠습니까?
                </p>

                <DialogFooter>
                    <Button variant="destructive" onClick={onConfirm}>
                        삭제하기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}