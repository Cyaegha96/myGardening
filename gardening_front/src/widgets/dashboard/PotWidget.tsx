import { useEffect, useState } from "react";
import { PotListControllerApi, type PotListDetailDTO } from "@/shared/api";
import { useNavigate } from "react-router-dom";
import { createEditor } from "lexical";
import { nodes } from "@/shared/shadcn/components/editor/blocks/editor-x/nodes.ts";
import { $generateHtmlFromNodes } from "@lexical/html";

export function PotWidget() {
    const [pots, setPots] = useState<PotListDetailDTO[]>([]);
    const navigate = useNavigate();

    // helper: JSON description → HTML 변환
    const generateDescriptionHtml = (description?: string) => {
        if (!description) return "";
        try {
            const editor = createEditor({ nodes });
            const json = JSON.parse(description);
            editor.setEditorState(editor.parseEditorState(json));

            let html = "";
            editor.update(() => {
                html = $generateHtmlFromNodes(editor);
            });

            return html;
        } catch (e) {
            console.error("description 변환 실패", e);
            return description; // fallback
        }
    };

    useEffect(() => {
        const fetchPots = async () => {
            try {
                const api = new PotListControllerApi();
                const res = await api.getMyPotList();
                const list = res.data ?? [];
                setPots(list);
            } catch (err) {
                console.error("내 화분 조회 실패:", err);
            }
        };

        fetchPots();
    }, []);

    return (
        <div className="flex flex-col gap-3">
            {pots.slice(0, 3).map((pot) => (
                <div
                    key={pot.id}
                    onClick={() => navigate(`/pot-list/${pot.id}`)}
                    className="border rounded-lg p-3 hover:bg-muted/40 transition cursor-pointer"
                >
                    <h3 className="font-medium text-sm">{pot.title}</h3>
                    <div
                        className="text-xs text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: generateDescriptionHtml(pot.description) }}
                    />
                </div>
            ))}
        </div>
    );
}
