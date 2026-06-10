import { BookingsRepository } from './bookings.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ReserveBookingDto } from './dto/reserve-booking.dto';
import { GetMyToursQueryDto } from './dto/get-my-tours-query.dto';
import { ToursService } from '../tours/tours.service';
export declare class BookingsService {
    private readonly bookingsRepository;
    private readonly toursService;
    constructor(bookingsRepository: BookingsRepository, toursService: ToursService);
    reserve(travellerId: string, dto: ReserveBookingDto): Promise<{
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
    getGuideBookings(guideId: string): Promise<{
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
    cancelBooking(bookingId: string, travellerId: string): Promise<{
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
    createBooking(travellerId: string, dto: CreateBookingDto): Promise<{
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
    getMyTours(travellerId: string, query: GetMyToursQueryDto): Promise<{
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
    startTour(bookingId: string, guideId: string): Promise<{
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
    completeTour(bookingId: string, guideId: string): Promise<{
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
    private _findAndAuthorizeGuide;
}
