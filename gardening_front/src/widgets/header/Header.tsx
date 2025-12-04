import React, {useEffect} from 'react';
import {Button} from '@/shared/shadcn/components/ui/button.tsx';
import {cn} from '@/shared/shadcn/lib/utils.ts';
import {MenuToggleIcon} from '@/shared/shadcn/components/ui/menu-toggle-icon.tsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Logo from '@/shared/assets/logo/myGardeningTextSecond.svg?react';
import {createPortal} from 'react-dom';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/shared/shadcn/components/ui/navigation-menu.tsx';
import {
    communityLinks,
    flowerShopLinks,
    gardeningLinks,
    loginLink,
    rankingLinks,
    registerLink
} from "@/entities/header/index.js";
import {ListItem} from "@/features/header/index.js";
import {useNavigate} from "react-router-dom";
import {type AuthState, useAuthStore} from "@/entities/auth/useAuthStore.tsx";
import {useUserInfoStore} from "@/widgets/header/useUserInfoStore.jsx.ts";


export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const navigate = useNavigate();
    const accessToken = useAuthStore((s: AuthState) => s.accessToken);
    const {userInfo, fetchUserInfo} = useUserInfoStore();
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);
    useEffect(() => {
        if (!accessToken) return;
        fetchUserInfo();
    }, [accessToken]);

    return (
        <header
            className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
                'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
                scrolled,
            })}
        >
            <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
                <div className="flex items-center gap-5">
                    <a onClick={() => navigate("/")} className="hover:bg-accent rounded-md p-2">
                        {/* 로고 자리 */}
                        <Logo className="w-20 h-8"/>
                    </a>
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">가드닝</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-background p-1 pr-1.5">
                                    <ul className="bg-popover grid w-lg grid-cols-1 gap-2 rounded-md border p-2 shadow">
                                        {gardeningLinks.map((item, i) => (
                                            <li key={i}>
                                                <ListItem {...item} />
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">커뮤니티</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                                    <ul className="bg-popover grid w-lg grid-cols-1 gap-2 rounded-md border p-2 shadow">
                                        {communityLinks.map((item, i) => (
                                            <li key={i}>
                                                <ListItem {...item} />
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">인기식물</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                                    <ul className="bg-popover grid w-lg grid-cols-1 gap-2 rounded-md border p-2 shadow">
                                        {rankingLinks.map((item, i) => (
                                            <li key={i}>
                                                <ListItem {...item} />
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">꽃집찾기</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-background p-1 pr-1.5 pb-1.5">
                                    <ul className="bg-popover grid w-lg grid-cols-1 gap-2 rounded-md border p-2 shadow">
                                        {flowerShopLinks.map((item, i) => (
                                            <li key={i}>
                                                <ListItem {...item} />
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                    {accessToken ? (
                        <>
                            <div className="flex items-center gap-2 cursor-pointer"
                                 onClick={() => navigate('/auth/dashboard')}>
                                <img
                                    src={userInfo?.profileUrl}
                                    alt="profile"
                                    className="w-8 h-8 rounded-full border"
                                />
                                <span className="text-sm font-medium">{userInfo?.nickname}</span>
                            </div>

                            <Button variant="outline" onClick={() => navigate('/auth/dashboard')}>
                                대시보드
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/oauth/edit-complete-profile')}>
                                내정보 수정
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => navigate(registerLink)}>회원가입</Button>
                            <Button onClick={() => navigate(loginLink)}>로그인</Button>
                        </>
                    )}
                </div>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setOpen(!open)}
                    className="md:hidden"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label="Toggle menu"
                >
                    <MenuToggleIcon open={open} className="size-5" duration={300}/>
                </Button>
            </nav>
            <MobileMenu open={open} onClick={() => setOpen(false)}
                        className="flex flex-col justify-between gap-2 overflow-y-auto">
                <NavigationMenu className="max-w-full">
                    <div className="flex w-full flex-col gap-y-2">
                        <span className="text-sm">가드닝</span>
                        {gardeningLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        <span className="text-sm">커뮤니티</span>
                        {communityLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        <span className="text-sm">인기식물</span>
                        {rankingLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                        <span className="text-sm">꽃집찾기</span>
                        {flowerShopLinks.map((link) => (
                            <ListItem key={link.title} {...link} />
                        ))}
                    </div>
                </NavigationMenu>
                {accessToken ? (
                    <>
                        <div className="flex items-center gap-2 cursor-pointer"
                             onClick={() => navigate('/auth/dashboard')}>
                            <img
                                src={userInfo?.profileUrl}
                                alt="profile"
                                className="w-8 h-8 rounded-full border"
                            />
                            <span className="text-sm font-medium">{userInfo?.nickname}</span>
                        </div>

                        <Button variant="outline" onClick={() => navigate('/auth/dashboard')}>
                            대시보드
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/oauth/edit-complete-profile')}>
                            내정보 수정
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="outline" onClick={() => navigate(registerLink)}>회원가입</Button>
                        <Button onClick={() => navigate(loginLink)}>로그인</Button>
                    </>
                )}
            </MobileMenu>
        </header>
    );
}

type MobileMenuProps = React.ComponentProps<'div'> & {
    open: boolean;
};

function MobileMenu({open, children, className, ...props}: MobileMenuProps) {
    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <div
            id="mobile-menu"
            className={cn(
                'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
                'fixed top-14 right-0 bottom-0 left-0 z-500 flex flex-col overflow-hidden border-y md:hidden',
            )}
        >
            <div
                data-slot={open ? 'open' : 'closed'}
                className={cn(
                    'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
                    'size-full p-4',
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}

function useScroll(threshold: number) {
    const [scrolled, setScrolled] = React.useState(false);

    const onScroll = React.useCallback(() => {
        setScrolled(window.scrollY > threshold);
    }, [threshold]);

    React.useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    // also check on first load
    React.useEffect(() => {
        onScroll();
    }, [onScroll]);

    return scrolled;
}