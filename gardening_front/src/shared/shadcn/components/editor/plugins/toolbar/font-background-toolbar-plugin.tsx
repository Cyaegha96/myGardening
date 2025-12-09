"use client"

import { useCallback, useState } from "react"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import {
  $getSelection,
  $isRangeSelection,
  type BaseSelection,
} from "lexical"
import { PaintBucketIcon } from "lucide-react"

import { useToolbarContext } from "@/shared/shadcn/components/editor/context/toolbar-context.tsx"
import { useUpdateToolbarHandler } from "@/shared/shadcn/components/editor/editor-hooks/use-update-toolbar.ts"
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerTrigger,
} from "@/shared/shadcn/components/editor/editor-ui/color-picker.tsx"
import { Button } from "@/shared/shadcn/components/ui/button.tsx"

export function FontBackgroundToolbarPlugin() {
  const { activeEditor } = useToolbarContext()

  const [bgColor, setBgColor] = useState("#fff")

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      )
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection()
          activeEditor.setEditable(false)
          if (selection !== null) {
            $patchStyleText(selection, styles)
          }
        },
        { tag: "historic" }
      )
    },
    [activeEditor]
  )

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value }, true)
    },
    [applyStyleText]
  )

  return (
    <ColorPicker
      modal
      defaultFormat="hex"
      defaultValue={bgColor}
      onValueChange={onBgColorSelect}
      onOpenChange={(open) => {
        if (!open) {
          activeEditor.setEditable(true)
          activeEditor.focus()
        }
      }}
    >
      <ColorPickerTrigger asChild>
        <Button variant={"outline"} size={"icon-sm"}>
          <PaintBucketIcon className="size-4" />
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <div className="flex items-center gap-2">
          <ColorPickerEyeDropper />
          <div className="flex flex-1 flex-col gap-2">
            <ColorPickerHueSlider />
            <ColorPickerAlphaSlider />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  )
}
