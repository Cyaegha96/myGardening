"use client"

import { TableIcon } from "lucide-react"

import { useToolbarContext } from "@/shared/shadcn/components/editor/context/toolbar-context.tsx"
import { InsertTableDialog } from "@/shared/shadcn/components/editor/plugins/table-plugin.tsx"
import { SelectItem } from "@/shared/shadcn/components/ui/select.tsx"

export function InsertTable() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="table"
      onPointerUp={() =>
        showModal("Insert Table", (onClose) => (
          <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <TableIcon className="size-4" />
        <span>Table</span>
      </div>
    </SelectItem>
  )
}
