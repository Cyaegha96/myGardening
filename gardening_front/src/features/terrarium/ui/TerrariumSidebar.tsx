import {Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger} from "@/shared/shadcn/components/ui/sidebar.tsx";
import {usePanelStore} from "@/features/terrarium/model/usePanelStore.ts";
import {categoryMap,type CategoryKey} from "@/features/terrarium/lib/categoryMap.ts";

export function TerrariumSidebar() {

    const {loadAssets,setPanelType,open} =usePanelStore();

    const openCategory = async (key:CategoryKey) => {
        const category = categoryMap[key];   // ← 매핑 적용

        await loadAssets(category);
        setPanelType(key);
        open();
    };


    return (

            <Sidebar className="border-r">
                <SidebarHeader>
                    <SidebarTrigger />
                    <div className="text-lg font-semibold">테라리움 꾸미기</div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>메뉴</SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => openCategory("rock")}>돌 종류</SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => openCategory("soil")}>흙 종류</SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => openCategory("tree")}>나무 종류</SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => openCategory("case")}>테라리움 케이스</SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => openCategory("raptile")}>파충류</SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <div className="text-sm text-muted-foreground">Terrarium</div>
                </SidebarFooter>
            </Sidebar>
    );
}