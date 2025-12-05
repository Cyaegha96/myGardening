import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";
import type {PlantTagDTO, PlantTagParentDTO} from "@/shared/api";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/shared/shadcn/components/ui/accordion.tsx";

export default function PotTagFilter({categories, selected, toggle}: {
    categories: { parentTag: PlantTagParentDTO, tagList: PlantTagDTO[] }[];
    selected: number[];
    toggle: (id: number) => void
}) {
    return (
        <aside className="p-4 mr-4">
            <h3 className="font-semibold mb-3">카테고리</h3>

            <Accordion type="multiple" className="w-full">
                {categories.map(cat => (
                    <AccordionItem key={cat.parentTag.tagId} value={String(cat.parentTag.tagId)} className="border-0 mb-1">

                        <AccordionTrigger className="text-left gap-2 cursor-pointer hover:bg-accent/50 rounded-sm hover:no-underline px-1 py-1">
                            {cat.parentTag.description}
                        </AccordionTrigger>

                        <AccordionContent>
                            <div className="space-y-2 ps-2">
                                {cat.tagList.map(tag => (
                                    <label
                                        key={tag.tagId}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded-sm px-1 py-1"
                                    >
                                        <Checkbox
                                            checked={selected.includes(tag.tagId!)}
                                            onCheckedChange={() => toggle(tag.tagId!)}
                                        />
                                        <span>{tag.tagName}</span>
                                    </label>
                                ))}
                            </div>
                        </AccordionContent>

                    </AccordionItem>
                ))}
            </Accordion>
        </aside>
    );
}