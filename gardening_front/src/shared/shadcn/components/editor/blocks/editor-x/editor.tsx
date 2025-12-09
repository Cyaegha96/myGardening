import {type InitialConfigType, LexicalComposer,} from "@lexical/react/LexicalComposer"
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin"
import {CLEAR_EDITOR_COMMAND, type EditorState, type SerializedEditorState} from "lexical"

import {editorTheme} from "@/shared/shadcn/components/editor/themes/editor-theme.ts"
import {TooltipProvider} from "@/shared/shadcn/components/ui/tooltip.tsx"

import {nodes} from "./nodes.ts"
import {Plugins} from "./plugins.tsx"
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect} from "react";

const editorConfig: InitialConfigType = {
    namespace: "Editor",
    theme: editorTheme,
    nodes,
    onError: (error: Error) => {
        console.error(error)
    },
}

export function Editor({
                           editorState,
                           editorSerializedState,
                           onChange,
                           onSerializedChange,
                           reset,
                       }: {
    editorState?: EditorState
    editorSerializedState?: SerializedEditorState
    onChange?: (editorState: EditorState) => void
    onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
    reset: boolean
}) {
    return (
        <div className="bg-background overflow-hidden rounded-lg border shadow">
            <LexicalComposer
                initialConfig={{
                    ...editorConfig,
                    ...(editorState ? {editorState} : {}),
                    ...(editorSerializedState
                        ? {editorState: JSON.stringify(editorSerializedState)}
                        : {}),
                }}
            >
                <EditorResetter reset={reset}/>
                <TooltipProvider>
                    <Plugins/>

                    <OnChangePlugin
                        ignoreSelectionChange={true}
                        onChange={(editorState) => {
                            onChange?.(editorState)
                            onSerializedChange?.(editorState.toJSON())
                        }}
                    />
                </TooltipProvider>
            </LexicalComposer>
        </div>
    )
}

function EditorResetter({ reset }: { reset: boolean }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (reset) {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        }
    }, [reset]);

    return null;
}
