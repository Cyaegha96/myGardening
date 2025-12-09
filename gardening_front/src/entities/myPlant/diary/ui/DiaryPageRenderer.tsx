// DiaryLayoutRenderer.tsx
// 여러 다이어리를 한 페이지에 유동 배치

const HEADER_HEIGHT = 80;
const FOOTER_MARGIN = 100;

// 창 크기에 따라 동적 계산
const getPageMaxHeight = () =>
    window.innerHeight - HEADER_HEIGHT - FOOTER_MARGIN;

// Diary 1개 높이 추정
const getDiaryHeight = (diary: any) => {
    if (diary.imageUrl) return 420; // 폴라로이드 거의 고정 높이

    const lineCount = diary.content?.split("\n").length ?? 0;
    return Math.min(lineCount, 8) * 32 + 60; // 텍스트만 있을 경우
};

export function renderDiaryPages(diaries: any[]): any[][] {
    const pages: any[][] = [];

    let curPage: any[] = [];
    let curHeight = 0;
    const MAX = getPageMaxHeight();

    diaries.forEach((diary) => {
        const h = getDiaryHeight(diary);

        if (curHeight + h > MAX) {
            pages.push(curPage);
            curPage = [];
            curHeight = 0;
        }

        curPage.push(diary);
        curHeight += h;
    });

    if (curPage.length > 0) pages.push(curPage);

    return pages;
}
