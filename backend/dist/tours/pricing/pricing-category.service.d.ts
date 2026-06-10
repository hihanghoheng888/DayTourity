export type PriceCategory = 'BUDGET' | 'STANDARD' | 'PREMIUM' | 'OUTLIER';
export interface PriceThresholds {
    q1: number;
    q3: number;
    iqr: number;
    lowerFence: number;
    upperFence: number;
}
export declare class PricingCategoryService {
    computeThresholds(prices: number[]): PriceThresholds | null;
    categorise(price: number, thresholds: PriceThresholds): PriceCategory;
    preferenceToCategories(preference: 'BUDGET' | 'STANDARD' | 'PREMIUM'): PriceCategory[];
    private percentile;
}
