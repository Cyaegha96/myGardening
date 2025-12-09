package com.ggirick.gardening_back.utils;

import org.springframework.web.util.HtmlUtils;

public class HtmlUtil {
    // 인스턴스 생성 막아두기
    private HtmlUtil() {}

    /**
     * HTML 태그 이스케이프 처리
     * <, >, &, " , ' 등 XSS 위험 문자 변환
     */
    public static String escape(String text) {
        if (text == null) return null;
        return HtmlUtils.htmlEscape(text);
    }

    /**
     * HTML 언이스케이프 처리 (필요할 경우)
     */
    public static String unescape(String text) {
        if (text == null) return null;
        return HtmlUtils.htmlUnescape(text);
    }
}
