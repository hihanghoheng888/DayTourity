import { BookingsService } from './bookings.service';
import { RequestUser } from '../auth/decorators/current-user.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ReserveBookingDto } from './dto/reserve-booking.dto';
import { GetMyToursQueryDto } from './dto/get-my-tours-query.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(user: RequestUser, dto: CreateBookingDto): Promise<{
        tour: {
            id: string;
            title: string;
            city: string;
            coverImageUrl: string;
        };
        guide: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }>;
    reserve(user: RequestUser, dto: ReserveBookingDto): Promise<{
        tour: {
            id: string;
            title: string;
            city: string;
            coverImageUrl: string;
        };
        guide: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }>;
    getMyTours(user: RequestUser, query: GetMyToursQueryDto): Promise<{
        data: ({
            tour: {
                id: string;
                title: string;
                city: string;
                coverImageUrl: string;
            };
            guide: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            guideId: string;
            tourId: string;
            status: import(".prisma/client").$Enums.TourStatus;
            scheduledDate: Date;
            agreedPrice: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            startedAt: Date | null;
            completedAt: Date | null;
            conversationId: string | null;
            travellerId: string;
        })[];
        total: number;
    }>;
    getGuideBookings(user: RequestUser): Promise<{
        data: ({
            tour: {
                id: string;
                title: string;
                city: string;
                coverImageUrl: string;
            };
            traveller: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            guideId: string;
            tourId: string;
            status: import(".prisma/client").$Enums.TourStatus;
            scheduledDate: Date;
            agreedPrice: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            startedAt: Date | null;
            completedAt: Date | null;
            conversationId: string | null;
            travellerId: string;
        })[];
        total: number;
    }>;
    cancel(id: string, user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }>;
    startTour(id: string, user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }>;
    completeTour(id: string, user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }>;
}
