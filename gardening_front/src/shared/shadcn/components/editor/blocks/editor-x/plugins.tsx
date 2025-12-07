import {useState} from "react"
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin"
import {CheckListPlugin} from "@lexical/react/LexicalCheckListPlugin"
import {ClearEditorPlugin} from "@lexical/react/LexicalClearEditorPlugin"
import {ClickableLinkPlugin} from "@lexical/react/LexicalClickableLinkPlugin"
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary"
import {HashtagPlugin} from "@lexical/react/LexicalHashtagPlugin"
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin"
import {HorizontalRulePlugin} from "@lexical/react/LexicalHorizontalRulePlugin"
import {ListPlugin} from "@lexical/react/LexicalListPlugin"
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin"
import {TabIndentationPlugin} from "@lexical/react/LexicalTabIndentationPlugin"
import {TablePlugin} from "@lexical/react/LexicalTablePlugin"

import {ContentEditable} from "@/shared/shadcn/components/editor/editor-ui/content-editable.tsx"
import {ActionsPlugin} from "@/shared/shadcn/components/editor/plugins/actions/actions-plugin.tsx"
import {CharacterLimitPlugin} from "@/shared/shadcn/components/editor/plugins/actions/character-limit-plugin.tsx"
import {ClearEditorActionPlugin} from "@/shared/shadcn/components/editor/plugins/actions/clear-editor-plugin.tsx"
import {CounterCharacterPlugin} from "@/shared/shadcn/components/editor/plugins/actions/counter-character-plugin.tsx"
import {MaxLengthPlugin} from "@/shared/shadcn/components/editor/plugins/actions/max-length-plugin.tsx"
import {AutoLinkPlugin} from "@/shared/shadcn/components/editor/plugins/auto-link-plugin.tsx"
import {CodeActionMenuPlugin} from "@/shared/shadcn/components/editor/plugins/code-action-menu-plugin.tsx"
import {CodeHighlightPlugin} from "@/shared/shadcn/components/editor/plugins/code-highlight-plugin.tsx"
import {ComponentPickerMenuPlugin} from "@/shared/shadcn/components/editor/plugins/component-picker-menu-plugin.tsx"
import {ContextMenuPlugin} from "@/shared/shadcn/components/editor/plugins/context-menu-plugin.tsx"
import {DragDropPastePlugin} from "@/shared/shadcn/components/editor/plugins/drag-drop-paste-plugin.tsx"
import {DraggableBlockPlugin} from "@/shared/shadcn/components/editor/plugins/draggable-block-plugin.tsx"
import {EmojiPickerPlugin} from "@/shared/shadcn/components/editor/plugins/emoji-picker-plugin.tsx"
import {EmojisPlugin} from "@/shared/shadcn/components/editor/plugins/emojis-plugin.tsx"
import {FloatingLinkEditorPlugin} from "@/shared/shadcn/components/editor/plugins/floating-link-editor-plugin.tsx"
import {
    FloatingTextFormatToolbarPlugin
} from "@/shared/shadcn/components/editor/plugins/floating-text-format-plugin.tsx"
import {KeywordsPlugin} from "@/shared/shadcn/components/editor/plugins/keywords-plugin.tsx"
import {LinkPlugin} from "@/shared/shadcn/components/editor/plugins/link-plugin.tsx"
import {ListMaxIndentLevelPlugin} from "@/shared/shadcn/components/editor/plugins/list-max-indent-level-plugin.tsx"
import {MentionsPlugin} from "@/shared/shadcn/components/editor/plugins/mentions-plugin.tsx"
import {AlignmentPickerPlugin} from "@/shared/shadcn/components/editor/plugins/picker/alignment-picker-plugin.tsx"
import {
    BulletedListPickerPlugin
} from "@/shared/shadcn/components/editor/plugins/picker/bulleted-list-picker-plugin.tsx"
import {CheckListPickerPlugin} from "@/shared/shadcn/components/editor/plugins/picker/check-list-picker-plugin.tsx"
import {CodePickerPlugin} from "@/shared/shadcn/components/editor/plugins/picker/code-picker-plugin.tsx"
import {DividerPickerPlugin} from "@/shared/shadcn/components/editor/plugins/picker/divider-picker-plugin.tsx"
import {HeadingPickerPlugin} from "@/shared/shadcn/components/editor/plugins/picker/heading-picker-plugin.tsx"
import {
    NumberedListPickerPlugin
} from "@/shared/shadcn/components/editor/plugins/picker/numbered-list-picker-plugin.tsx"
import {ParagraphPickerPlugin} from "@/shared/shadcn/components/editor/plugins/picker/paragraph-picker-plugin.tsx"
import {QuotePickerPlugin} from "@/shared/shadcn/components/editor/plugins/picker/quote-picker-plugin.tsx"
import {DynamicTablePickerPlugin,} from "@/shared/shadcn/components/editor/plugins/picker/table-picker-plugin.tsx"
import {TabFocusPlugin} from "@/shared/shadcn/components/editor/plugins/tab-focus-plugin.tsx"
import {BlockFormatDropDown} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format-toolbar-plugin.tsx"
import {
    FormatBulletedList
} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format/format-bulleted-list.tsx"
import {FormatCheckList} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format/format-check-list.tsx"
import {FormatCodeBlock} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format/format-code-block.tsx"
import {FormatHeading} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format/format-heading.tsx"
import {
    FormatNumberedList
} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format/format-numbered-list.tsx"
import {FormatParagraph} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format/format-paragraph.tsx"
import {FormatQuote} from "@/shared/shadcn/components/editor/plugins/toolbar/block-format/format-quote.tsx"
import {
    ClearFormattingToolbarPlugin
} from "@/shared/shadcn/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin.tsx"
import {
    CodeLanguageToolbarPlugin
} from "@/shared/shadcn/components/editor/plugins/toolbar/code-language-toolbar-plugin.tsx"
import {
    ElementFormatToolbarPlugin
} from "@/shared/shadcn/components/editor/plugins/toolbar/element-format-toolbar-plugin.tsx"
import {
    FontBackgroundToolbarPlugin
} from "@/shared/shadcn/components/editor/plugins/toolbar/font-background-toolbar-plugin.tsx"
import {FontColorToolbarPlugin} from "@/shared/shadcn/components/editor/plugins/toolbar/font-color-toolbar-plugin.tsx"
import {FontFormatToolbarPlugin} from "@/shared/shadcn/components/editor/plugins/toolbar/font-format-toolbar-plugin.tsx"
import {FontSizeToolbarPlugin} from "@/shared/shadcn/components/editor/plugins/toolbar/font-size-toolbar-plugin.tsx"
import {HistoryToolbarPlugin} from "@/shared/shadcn/components/editor/plugins/toolbar/history-toolbar-plugin.tsx"
import {LinkToolbarPlugin} from "@/shared/shadcn/components/editor/plugins/toolbar/link-toolbar-plugin.tsx"
import {SubSuperToolbarPlugin} from "@/shared/shadcn/components/editor/plugins/toolbar/subsuper-toolbar-plugin.tsx"
import {ToolbarPlugin} from "@/shared/shadcn/components/editor/plugins/toolbar/toolbar-plugin.tsx"
import {Separator} from "@/shared/shadcn/components/ui/separator.tsx"

const placeholder = "여기에 내용을 입력하세요... (‘/’로 명령어 사용 가능)"
const maxLength = 500

export function Plugins({}) {
    const [floatingAnchorElem, setFloatingAnchorElem] =
        useState<HTMLDivElement | null>(null)
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem)
        }
    }

    return (
        <div className="relative">
            <ToolbarPlugin>
                {({blockType}) => (
                    <div
                        className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
                        <HistoryToolbarPlugin/>
                        <Separator orientation="vertical" className="!h-7"/>
                        <BlockFormatDropDown>
                            <FormatParagraph/>
                            <FormatHeading levels={["h1", "h2", "h3"]}/>
                            <FormatNumberedList/>
                            <FormatBulletedList/>
                            <FormatCheckList/>
                            <FormatCodeBlock/>
                            <FormatQuote/>
                        </BlockFormatDropDown>
                        {blockType === "code" ? (
                            <CodeLanguageToolbarPlugin/>
                        ) : (
                            <>
                                <FontSizeToolbarPlugin/>
                                <Separator orientation="vertical" className="!h-7"/>
                                <FontFormatToolbarPlugin/>
                                <Separator orientation="vertical" className="!h-7"/>
                                <SubSuperToolbarPlugin/>
                                <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode}/>
                                <Separator orientation="vertical" className="!h-7"/>
                                <ClearFormattingToolbarPlugin/>
                                <Separator orientation="vertical" className="!h-7"/>
                                <FontColorToolbarPlugin/>
                                <FontBackgroundToolbarPlugin/>
                                <Separator orientation="vertical" className="!h-7"/>
                                <ElementFormatToolbarPlugin/>
                            </>
                        )}
                    </div>
                )}
            </ToolbarPlugin>
            <div className="relative">
                <AutoFocusPlugin/>
                <RichTextPlugin
                    contentEditable={
                        <div className="">
                            <div className="" ref={onRef}>
                                <ContentEditable
                                    placeholder={placeholder}
                                    className="ContentEditable__root relative block h-[50vh] overflow-auto px-8 py-4 focus:outline-none"
                                />
                            </div>
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />

                <ClickableLinkPlugin/>
                <CheckListPlugin/>
                <HorizontalRulePlugin/>
                <TablePlugin/>
                <ListPlugin/>
                <TabIndentationPlugin/>
                <HashtagPlugin/>
                <HistoryPlugin/>

                <MentionsPlugin/>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem}/>
                <KeywordsPlugin/>
                <EmojisPlugin/>

                <CodeHighlightPlugin/>
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem}/>

                <TabFocusPlugin/>
                <AutoLinkPlugin/>
                <LinkPlugin/>

                <ComponentPickerMenuPlugin
                    baseOptions={[
                        ParagraphPickerPlugin(),
                        HeadingPickerPlugin({n: 1}),
                        HeadingPickerPlugin({n: 2}),
                        HeadingPickerPlugin({n: 3}),
                        CheckListPickerPlugin(),
                        NumberedListPickerPlugin(),
                        BulletedListPickerPlugin(),
                        QuotePickerPlugin(),
                        CodePickerPlugin(),
                        DividerPickerPlugin(),
                        AlignmentPickerPlugin({alignment: "left"}),
                        AlignmentPickerPlugin({alignment: "center"}),
                        AlignmentPickerPlugin({alignment: "right"}),
                        AlignmentPickerPlugin({alignment: "justify"}),
                    ]}
                    dynamicOptionsFn={DynamicTablePickerPlugin}
                />

                <ContextMenuPlugin/>
                <DragDropPastePlugin/>
                <EmojiPickerPlugin/>

                <FloatingLinkEditorPlugin
                    anchorElem={floatingAnchorElem}
                    isLinkEditMode={isLinkEditMode}
                    setIsLinkEditMode={setIsLinkEditMode}
                />
                <FloatingTextFormatToolbarPlugin
                    anchorElem={floatingAnchorElem}
                    setIsLinkEditMode={setIsLinkEditMode}
                />

                <ListMaxIndentLevelPlugin/>
            </div>
            <ActionsPlugin>
                <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
                    <div className="flex flex-1 justify-start">
                        <MaxLengthPlugin maxLength={maxLength}/>
                        <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16"/>
                    </div>
                    <div>
                        <CounterCharacterPlugin charset="UTF-16"/>
                    </div>
                    <div className="flex flex-1 justify-end">
                        <>
                            <ClearEditorActionPlugin/>
                            <ClearEditorPlugin/>
                        </>
                    </div>
                </div>
            </ActionsPlugin>
        </div>
    )
}
