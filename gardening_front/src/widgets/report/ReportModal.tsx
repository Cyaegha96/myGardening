import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/shadcn/components/ui/dialog";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Textarea } from "@/shared/shadcn/components/ui/textarea";
import { ReportControllerApi } from "@/shared/api";

interface Props {
    open: boolean;
    onClose: () => void;
    targetId: number;
    targetType: string;   // 예: "BOARD", "COMMENT", "USER"
}

export default function ReportModal({ open, onClose, targetId, targetType }: Props) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            alert("신고 사유를 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            const api = new ReportControllerApi();
            await api.createReport({
                targetId,
                targetType,
                reason,
            });

            alert("신고가 접수되었습니다.");
            onClose();
            setReason("");
        } catch (err) {
            console.error("신고 실패:", err);
            alert("신고 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>신고하기</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="text-sm text-gray-700">
                        게시글을 신고하려면 아래 입력칸에 사유를 적어주세요.
                    </div>

                    <Textarea
                        placeholder="신고 사유를 입력하세요"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[120px]"
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            취소
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "전송 중..." : "신고하기"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
