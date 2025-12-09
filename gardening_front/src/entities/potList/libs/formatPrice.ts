// 가격 포맷 함수
export const formatPrice = (value: string | number, prefix: string = "") => {
    if (!value) return prefix + "0";
    const num = typeof value === "number" ? value : Number(value.replace(/[^\d]/g, ""));
    if (isNaN(num)) return "";
    return prefix + num.toLocaleString();
};