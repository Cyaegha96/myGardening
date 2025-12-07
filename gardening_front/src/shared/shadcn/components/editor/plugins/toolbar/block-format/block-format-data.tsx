import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  QuoteIcon,
  TextIcon,
} from "lucide-react"

export const blockTypeToBlockName: Record<
    string,
    { label: string; icon: React.ReactNode }
> = {
    paragraph: {
        label: "본문",
        icon: <TextIcon className="size-4" />,
    },
    h1: {
        label: "제목 1",
        icon: <Heading1Icon className="size-4" />,
    },
    h2: {
        label: "제목 2",
        icon: <Heading2Icon className="size-4" />,
    },
    h3: {
        label: "제목 3",
        icon: <Heading3Icon className="size-4" />,
    },
    number: {
        label: "번호 목록",
        icon: <ListOrderedIcon className="size-4" />,
    },
    bullet: {
        label: "불릿 목록",
        icon: <ListIcon className="size-4" />,
    },
    check: {
        label: "체크리스트",
        icon: <ListTodoIcon className="size-4" />,
    },
    code: {
        label: "코드 블록",
        icon: <CodeIcon className="size-4" />,
    },
    quote: {
        label: "인용구",
        icon: <QuoteIcon className="size-4" />,
    },
}

