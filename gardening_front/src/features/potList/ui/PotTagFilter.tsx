import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";


type Category = { id: number; name: string };

export default function PotTagFilter({ categories, selected, toggle }: { categories: Category[]; selected: Set<number>; toggle: (id: number) => void }) {
    return (
        <aside className="p-4 md:border-r mr-4">
            <h3 className="font-semibold mb-3">필터</h3>
            <div className="space-y-2">
                {categories.map(cat => (
                    <label key={cat.id} className="cursor-pointer flex items-center gap-2 ps-1 hover:bg-accent/50 transition rounded-sm">
                        <Checkbox checked={selected.has(cat.id)} onCheckedChange={() => toggle(cat.id)} />
                        <span>{cat.name}</span>
                    </label>
                ))}
            </div>
        </aside>
    );
}