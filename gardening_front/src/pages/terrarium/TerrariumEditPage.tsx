import {TerrariumSidebar} from "@/features/terrarium/ui/TerrariumSidebar.tsx";
import {TerrariumPanel} from "@/features/terrarium/ui/TerrariumPanel.tsx";
import {SidebarProvider} from "@/shared/shadcn/components/ui/sidebar.tsx";
import TerrariumCanvas from "@/features/terrarium/ui/TerrariumCanvas.tsx";
import {LayersPanel} from "@/features/terrarium/ui/LayersPanel.tsx";

export default function TerrariumEditPage() {

    return (
        <SidebarProvider >
        <div className="flex relative h-screen gap-5">
            <TerrariumSidebar/>
            <TerrariumPanel/>
            <main className="flex-1 p-4">
                <div className="w-full h-full rounded-md flex gap-10">
                <TerrariumCanvas/>
                    <LayersPanel/>
                </div>

            </main>
        </div>
        </SidebarProvider>
    );
}