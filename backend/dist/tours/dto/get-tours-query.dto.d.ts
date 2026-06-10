export declare enum PriceCategoryFilter {
    BUDGET = "BUDGET",
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM"
}
export declare class GetToursQueryDto {
    city?: string;
    priceCategory?: PriceCategoryFilter;
}
