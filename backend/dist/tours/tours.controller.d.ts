import { ToursService } from './tours.service';
import { GetToursQueryDto } from './dto/get-tours-query.dto';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { RequestUser } from '../auth/decorators/current-user.decorator';
export declare class ToursController {
    private readonly toursService;
    constructor(toursService: ToursService);
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
    create(user: RequestUser, dto: CreateTourDto): Promise<{
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
    update(id: string, user: RequestUser, dto: UpdateTourDto): Promise<{
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
    deleteTour(id: string, user: RequestUser): Promise<{
        message: string;
    }>;
    addPhoto(tourId: string, user: RequestUser, dto: AddPhotoDto): Promise<{
        id: string;
        createdAt: Date;
        tourId: string;
        url: string;
        order: number;
    }>;
    removePhoto(tourId: string, photoId: string, user: RequestUser): Promise<{
        message: string;
    }>;
}
