import {Amphora, Award, CalendarIcon, type LucideIcon, Notebook, Search, Sprout, Store, Users} from "lucide-react";

export type LinkItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    description?: string;
};

export const loginLink = "/auth/login";
export const registerLink = "/auth/register";

export const gardeningLinks: LinkItem[] = [
    {
        title: '내 식물',
        href: 'my-plants',
        description: '내가 키우는 식물들의 성장과 변화를 편하게 기록하고 관리하는 공간입니다',
        icon: Sprout,
    },
    {
        title: '일정',
        href: 'schedule',
        description: '물 주기부터 비료·분갈이 일정까지, 식물 케어 루틴을 손쉽게 확인하는 공간입니다',
        icon: CalendarIcon,
    },
    {
        title: '테라리움',
        href: 'terrariumEdit',
        description: '나만의 작은 정원을 디자인하고 감각적인 테라리움을 탐험하는 공간입니다',
        icon: Amphora,
    },
    {
        title: '식물검색',
        href: 'plant-search',
        description: '다양한 식물 정보를 한눈에 찾아보고 새로운 식물들과 만나는 공간입니다',
        icon: Search,
    },
];

export const communityLinks: LinkItem[] = [
    {
        title: '게시판',
        href: 'board',
        description: '식물 이야기와 정원 라이프를 자유롭게 나누는 공간입니다',
        icon: Notebook,
    },
    {
        title: '식물분양',
        href: 'pot-list',
        description: '식물을 나누고 새로운 반려식물을 만날 수 있는 따뜻한 교류의 공간입니다',
        icon: Users,
    },
];

export const rankingLinks: LinkItem[] = [
    {
        title: '인기식물',
        href: 'popularPlants',
        description: '다양한 식물의 랭킹을 소개하는 공간입니다',
        icon: Award,
    },
];

export const flowerShopLinks: LinkItem[] = [
    {
        title: '꽃집찾기',
        href: 'flower-shop',
        description: '내 주변 꽃집 정보를 한눈에 보고 원하는 식물을 쉽게 찾아보는 공간입니다',
        icon: Store,
    },
];