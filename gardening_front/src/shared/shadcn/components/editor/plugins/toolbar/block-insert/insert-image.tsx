import { ImageIcon } from "lucide-react"

import { useToolbarContext } from "@/shared/shadcn/components/editor/context/toolbar-context.tsx"
import { InsertImageDialog } from "@/shared/shadcn/components/editor/plugins/images-plugin.tsx"
import { SelectItem } from "@/shared/shadcn/components/ui/select.tsx"

export function InsertImage() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="image"
      onPointerUp={(e) => {
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }}
      className=""
    >
      <div className="flex items-center gap-1">
        <ImageIcon className="size-4" />
        <span>Image</span>
      </div>
    </SelectItem>
  )
}
