const PROVINCES = [
    "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
    "대전광역시", "울산광역시", "세종", "경기도", "강원도", "충청북도",
    "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
];

export interface AddressParts {
    province: string;  // 시/도
    district: string;  // 구/군
    neighborhood: string; // 동
    detail: string;    // 나머지 상세주소
}

export function splitKoreanAddress(address: string): AddressParts {
    const parts = address.trim().split(/\s+/);

    let province = "";
    let district = "";
    let neighborhood = "";
    let detail = "";

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (!province && PROVINCES.filter(item => item.includes(part))) {
            province = part;
        } else if (!district && /([구군시])$/.test(part)) {
            district = part;
        } else if (!neighborhood && /([동읍면리])$/.test(part)) {
            neighborhood = part;
        } else {
            detail += (detail ? " " : "") + part;
        }
    }

    return { province, district, neighborhood, detail };
}