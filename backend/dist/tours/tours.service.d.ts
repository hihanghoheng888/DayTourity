import { ToursRepository } from './tours.repository';
import { PricingCategoryService } from './pricing/pricing-category.service';
import { GetToursQueryDto } from './dto/get-tours-query.dto';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
export declare class ToursService {
    private readonly toursRepository;
    private readonly pricingService;
    constructor(toursRepository: ToursRepository, pricingService: PricingCategoryService);
    getRecommended(query: GetToursQueryDto): Promise<{
        tours: {
            id: any;
            title: any;
            description: any;
            city: any;
            basePrice: number;
            coverImageUrl: any;
            isActive: any;
            availableDates: any;
            photos: any;
            totalPrice: any;
            priceCategory: any;
            guide: any;
            activities: any;
            createdAt: any;
        }[];
        meta: {
            city: string;
            priceCategory: import("./dto/get-tours-query.dto").PriceCategoryFilter;
            thresholds: {
                q1: number;
                q3: number;
                iqr: number;
                upperFence: number;
            };
        };
    }>;
    findById(id: string): Promise<{
        id: any;
        title: any;
        description: any;
        city: any;
        basePrice: number;
        coverImageUrl: any;
        isActive: any;
        availableDates: any;
        photos: any;
        totalPrice: any;
        priceCategory: any;
        guide: any;
        activities: any;
        createdAt: any;
    }>;
    create(guideId: string, dto: CreateTourDto): Promise<{
        id: any;
        title: any;
        description: any;
        city: any;
        basePrice: number;
        coverImageUrl: any;
        isActive: any;
        availableDates: any;
        photos: any;
        totalPrice: any;
        priceCategory: any;
        guide: any;
        activities: any;
        createdAt: any;
    }>;
    updateTour(id: string, guideId: string, dto: UpdateTourDto): Promise<{
        id: any;
        title: any;
        description: any;
        city: any;
        basePrice: number;
        coverImageUrl: any;
        isActive: any;
        availableDates: any;
        photos: any;
        totalPrice: any;
        priceCategory: any;
        guide: any;
        activities: any;
        createdAt: any;
    }>;
    deleteTour(id: string, guideId: string): Promise<{
        message: string;
    }>;
    addPhoto(tourId: string, guideId: string, url: string): Promise<{
        id: string;
        createdAt: Date;
        tourId: string;
        url: string;
        order: number;
    }>;
    removePhoto(tourId: string, photoId: string, guideId: string): Promise<{
        message: string;
    }>;
    private computeTourPrice;
    private tourTotal;
    private serializeTour;
}
