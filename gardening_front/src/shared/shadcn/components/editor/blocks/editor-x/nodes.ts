import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { OverflowNode } from "@lexical/overflow"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
    type Klass,
    type LexicalNode,
    type LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"

import { AutocompleteNode } from "@/shared/shadcn/components/editor/nodes/autocomplete-node.tsx"
import { TweetNode } from "@/shared/shadcn/components/editor/nodes/embeds/tweet-node.tsx"
import { YouTubeNode } from "@/shared/shadcn/components/editor/nodes/embeds/youtube-node.tsx"
import { EmojiNode } from "@/shared/shadcn/components/editor/nodes/emoji-node.tsx"
import { ImageNode } from "@/shared/shadcn/components/editor/nodes/image-node.tsx"
import { KeywordNode } from "@/shared/shadcn/components/editor/nodes/keyword-node.tsx"
import { LayoutContainerNode } from "@/shared/shadcn/components/editor/nodes/layout-container-node.tsx"
import { LayoutItemNode } from "@/shared/shadcn/components/editor/nodes/layout-item-node.tsx"
import { MentionNode } from "@/shared/shadcn/components/editor/nodes/mention-node.ts"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    HashtagNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    MentionNode,
    ImageNode,
    EmojiNode,
    KeywordNode,
    LayoutContainerNode,
    LayoutItemNode,
    AutoLinkNode,
    TweetNode,
    YouTubeNode,
    AutocompleteNode,
  ]
