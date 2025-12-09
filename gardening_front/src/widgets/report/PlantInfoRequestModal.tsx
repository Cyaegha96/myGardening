import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/shadcn/components/ui/dialog";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Label } from "@/shared/shadcn/components/ui/label";
import { Separator } from "@/shared/shadcn/components/ui/separator";
import axiosInterceptor from "@/shared/api/axiosInterceptor";
import { cn } from "@/shared/shadcn/lib/utils";

interface Props {
    open: boolean;
    onClose: () => void;
    scientificName: string | undefined;
}

export default function PlantInfoRequestModal({ open, onClose, scientificName }: Props) {
    const [changes, setChanges] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const resetState = () => {
        setChanges("");
        setFiles([]);
        setPreviewUrls([]);
    };

    /** 파일 추가 */
    const addFiles = (incomingFiles: File[]) => {
        const validFiles = incomingFiles.filter(f => f.type.startsWith("image/"));

        setFiles(prev => [...prev, ...validFiles]);
        setPreviewUrls(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
    };

    /** 파일 input으로 추가 */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        addFiles(Array.from(e.target.files));
    };

    /** 드래그 앤 드롭 */
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files);
        addFiles(dropped);
    };

    /** 개별 삭제 */
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    /** 제출 */
    const handleSubmit = async () => {
        setLoading(true);

        const formData = new FormData();
        const body = { scientificName, changes };

        formData.append("request", new Blob([JSON.stringify(body)], { type: "application/json" }));

        files.forEach(f => formData.append("files", f));

        try {
            await axiosInterceptor.post("/plant-info-request", formData);
            alert("제보가 완료되었습니다!");

            resetState();
            onClose();
        } catch (e) {
            alert("요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
            if (!v) resetState();
            onClose();
        }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>식물 정보 제보</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">

                    {/* 학명 */}
                    <div>
                        <Label className="mb-1 block">학명</Label>
                        <input
                            value={scientificName}
                            readOnly
                            className="w-full px-3 py-2 rounded border bg-muted"
                        />
                    </div>

                    {/* 변경 내용 */}
                    <div>
                        <Label className="mb-1 block">어떤 내용이 잘못되었나요?</Label>
                        <textarea
                            value={changes}
                            onChange={e => setChanges(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <Separator />

                    {/* 파일 업로드 (DND) */}
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={cn(
                            "border-2 border-dashed rounded p-6 text-center cursor-pointer transition",
                            "hover:bg-muted",
                        )}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <p className="text-sm text-muted-foreground">
                            이미지 파일을 드래그하거나 클릭해 업로드하세요
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>

                    {/* 미리보기 */}
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 pt-2">
                            {previewUrls.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={url}
                                        className="w-full h-24 object-cover rounded border"
                                    />
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => { resetState(); onClose(); }}>
                        닫기
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "전송중..." : "제보하기"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
