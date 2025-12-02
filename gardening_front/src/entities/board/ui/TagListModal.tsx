// TagListModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/shadcn/components/ui/dialog";

interface TagListModalProps {
    open: boolean;
    onClose: (open: boolean) => void;
    tags: string[];
}

export default function TagListModal({ open, onClose, tags }: TagListModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>태그 목록</DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.length > 0 ? (
                        tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-primary/20 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500">태그가 없습니다.</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}