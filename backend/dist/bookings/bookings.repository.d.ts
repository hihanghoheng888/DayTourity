import { Prisma, TourStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findConversationWithBooking(conversationId: string): Prisma.Prisma__ConversationClient<{
        booking: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            guideId: string;
            tourId: string;
            status: import(".prisma/client").$Enums.TourStatus;
            scheduledDate: Date;
            agreedPrice: Prisma.Decimal;
            notes: string | null;
            startedAt: Date | null;
            completedAt: Date | null;
            conversationId: string | null;
            travellerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createBooking(data: Prisma.BookingUncheckedCreateInput): Prisma.Prisma__BookingClient<{
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
        agreedPrice: Prisma.Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findManyByTraveller(travellerId: string, statusFilter: TourStatus[]): Prisma.PrismaPromise<({
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
        agreedPrice: Prisma.Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    })[]>;
    findManyByGuide(guideId: string): Prisma.PrismaPromise<({
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
        agreedPrice: Prisma.Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    })[]>;
    findActiveByTourAndTraveller(tourId: string, travellerId: string): Prisma.Prisma__BookingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: Prisma.Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findBookingById(bookingId: string): Prisma.Prisma__BookingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: Prisma.Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStatus(bookingId: string, data: Prisma.BookingUncheckedUpdateInput): Prisma.Prisma__BookingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        status: import(".prisma/client").$Enums.TourStatus;
        scheduledDate: Date;
        agreedPrice: Prisma.Decimal;
        notes: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        conversationId: string | null;
        travellerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
