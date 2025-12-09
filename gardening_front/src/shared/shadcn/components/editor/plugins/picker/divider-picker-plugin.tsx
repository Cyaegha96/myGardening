import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode"
import { MinusIcon } from "lucide-react"

import { ComponentPickerOption } from "@/shared/shadcn/components/editor/plugins/picker/component-picker-option"

export function DividerPickerPlugin() {
  return new ComponentPickerOption("구분선", {
    icon: <MinusIcon className="size-4" />,
    keywords: ["horizontal rule", "divider", "hr"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
  })
}
