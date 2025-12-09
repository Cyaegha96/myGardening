"use client"

import { Columns3Icon } from "lucide-react"

import { useToolbarContext } from "@/shared/shadcn/components/editor/context/toolbar-context.tsx"
import { InsertLayoutDialog } from "@/shared/shadcn/components/editor/plugins/layout-plugin.tsx"
import { SelectItem } from "@/shared/shadcn/components/ui/select.tsx"

export function InsertColumnsLayout() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="columns"
      onPointerUp={() =>
        showModal("Insert Columns Layout", (onClose) => (
          <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <Columns3Icon className="size-4" />
        <span>Columns Layout</span>
      </div>
    </SelectItem>
  )
}
