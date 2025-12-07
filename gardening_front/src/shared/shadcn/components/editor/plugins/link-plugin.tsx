import * as React from "react"
import { JSX } from "react"
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin"

import { validateUrl } from "@/shared/shadcn/components/editor/utils/url.ts"

export function LinkPlugin(): JSX.Element {
  return <LexicalLinkPlugin validateUrl={validateUrl} />
}
