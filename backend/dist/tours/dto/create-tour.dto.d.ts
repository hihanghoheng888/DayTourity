declare enum PricingType {
    FIXED = "FIXED",
    RANGE = "RANGE"
}
export declare class CreateActivityDto {
    name: string;
    description?: string;
    pricingType: PricingType;
    fixedPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    order: number;
}
export declare class CreateTourDto {
    title: string;
    description: string;
    city: string;
    basePrice?: number;
    coverImageUrl?: string;
    availableDates?: string[];
    photoUrls?: string[];
    activities: CreateActivityDto[];
}
export {};
