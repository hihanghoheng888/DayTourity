import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class ToursRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findManyActive(where: Prisma.TourWhereInput): Prisma.PrismaPromise<({
        guide: {
            name: string;
            id: string;
            email: string;
        };
        activities: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            tourId: string;
            order: number;
            pricingType: import(".prisma/client").$Enums.PricingType;
            fixedPrice: Prisma.Decimal | null;
            minPrice: Prisma.Decimal | null;
            maxPrice: Prisma.Decimal | null;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            tourId: string;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        city: string;
        guideId: string;
        basePrice: Prisma.Decimal;
        coverImageUrl: string | null;
        availableDates: Date[];
        isActive: boolean;
    })[]>;
    findByIdWithDetails(id: string): Prisma.Prisma__TourClient<{
        guide: {
            name: string;
            id: string;
            email: string;
        };
        activities: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            tourId: string;
            order: number;
            pricingType: import(".prisma/client").$Enums.PricingType;
            fixedPrice: Prisma.Decimal | null;
            minPrice: Prisma.Decimal | null;
            maxPrice: Prisma.Decimal | null;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            tourId: string;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        city: string;
        guideId: string;
        basePrice: Prisma.Decimal;
        coverImageUrl: string | null;
        availableDates: Date[];
        isActive: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findById(id: string): Prisma.Prisma__TourClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        city: string;
        guideId: string;
        basePrice: Prisma.Decimal;
        coverImageUrl: string | null;
        availableDates: Date[];
        isActive: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: Prisma.TourUncheckedCreateInput): Prisma.Prisma__TourClient<{
        guide: {
            name: string;
            id: string;
            email: string;
        };
        activities: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            tourId: string;
            order: number;
            pricingType: import(".prisma/client").$Enums.PricingType;
            fixedPrice: Prisma.Decimal | null;
            minPrice: Prisma.Decimal | null;
            maxPrice: Prisma.Decimal | null;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            tourId: string;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        city: string;
        guideId: string;
        basePrice: Prisma.Decimal;
        coverImageUrl: string | null;
        availableDates: Date[];
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Prisma.TourUpdateInput): Prisma.Prisma__TourClient<{
        guide: {
            name: string;
            id: string;
            email: string;
        };
        activities: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            tourId: string;
            order: number;
            pricingType: import(".prisma/client").$Enums.PricingType;
            fixedPrice: Prisma.Decimal | null;
            minPrice: Prisma.Decimal | null;
            maxPrice: Prisma.Decimal | null;
        }[];
        photos: {
            id: string;
            createdAt: Date;
            tourId: string;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        city: string;
        guideId: string;
        basePrice: Prisma.Decimal;
        coverImageUrl: string | null;
        availableDates: Date[];
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete(id: string): Prisma.Prisma__TourClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        city: string;
        guideId: string;
        basePrice: Prisma.Decimal;
        coverImageUrl: string | null;
        availableDates: Date[];
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findLastPhoto(tourId: string): Prisma.Prisma__TourPhotoClient<{
        id: string;
        createdAt: Date;
        tourId: string;
        url: string;
        order: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createPhoto(data: {
        tourId: string;
        url: string;
        order: number;
    }): Prisma.Prisma__TourPhotoClient<{
        id: string;
        createdAt: Date;
        tourId: string;
        url: string;
        order: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findPhotoById(photoId: string): Prisma.Prisma__TourPhotoClient<{
        id: string;
        createdAt: Date;
        tourId: string;
        url: string;
        order: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    deletePhoto(photoId: string): Prisma.Prisma__TourPhotoClient<{
        id: string;
        createdAt: Date;
        tourId: string;
        url: string;
        order: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
