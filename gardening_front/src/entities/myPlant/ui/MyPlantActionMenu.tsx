import { useState } from "react";
import { MoreVertical } from "lucide-react";
import type {MyPlantActionMenuProps} from "@/entities/myPlant/model/MyPlantActionMenuProps.ts";

export default function MyPlantActionMenu({ onEdit, onDelete }: MyPlantActionMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative">
            {/* 메뉴 버튼 */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(prev => !prev);
                }}
                className="p-1 rounded hover:bg-gray-200"
            >
                <MoreVertical size={18} />
            </button>

            {/* 메뉴 목록 */}
            {menuOpen && (
                <div
                    className="absolute right-0 mt-2 w-24 bg-white border rounded shadow text-sm z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() => { setMenuOpen(false); onEdit(); }}
                    >
                        수정
                    </button>

                    <button
                        className="block w-full px-3 py-2 text-left text-red-500 hover:bg-red-50"
                        onClick={() => { setMenuOpen(false); onDelete(); }}
                    >
                        삭제
                    </button>
                </div>
            )}
        </div>
    );
}
