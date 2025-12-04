import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/shared/shadcn/components/ui/sheet";
import {Button} from "@/shared/shadcn/components/ui/button";
import {Heart} from "lucide-react";
import {useState} from "react";

export default function PotBookmarkDrawer() {
    const [isSheetOpen, setSheetOpen] = useState<boolean>(false);

    return (
        <div>
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <div className="fixed bottom-40 right-6 md:bottom-46 md:right-8 z-50">
                        <Button
                            className="relative bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg w-14 h-14 md:w-16 md:h-16 transition-transform hover:scale-105">
                            <Heart className="size-5 md:size-6"/>
                        </Button>
                    </div>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    className="min-w-full md:min-w-1/5 flex flex-col z-150"
                >
                    <SheetHeader>
                        <SheetTitle>
                            찜 한 분양글
                        </SheetTitle>
                    </SheetHeader>

                    {/* 목록 */}

                </SheetContent>
            </Sheet>
        </div>
    );
}
