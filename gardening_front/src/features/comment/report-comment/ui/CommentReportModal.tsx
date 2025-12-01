import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/shadcn/components/ui/dialog";
import { Button } from "@/shared/shadcn/components/ui/button";

export function CommentReportModal({
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
                    <DialogTitle>댓글 신고</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600">
                    이 댓글을 신고하시겠습니까?
                </p>

                <DialogFooter>
                    <Button variant="destructive" onClick={onConfirm}>
                        신고하기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}