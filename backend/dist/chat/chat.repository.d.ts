import { BookingStatus, MessageType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class ChatRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findConversationByParticipants(userId: string, guideId: string, tourId: string): import(".prisma/client").Prisma.Prisma__ConversationClient<{
        user: {
            name: string;
            id: string;
        };
        tour: {
            id: string;
            title: string;
            coverImageUrl: string;
        };
        messages: ({
            sender: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            type: import(".prisma/client").$Enums.MessageType;
            content: string;
            isRead: boolean;
        })[];
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
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createConversation(data: {
        userId: string;
        guideId: string;
        tourId: string;
    }): import(".prisma/client").Prisma.Prisma__ConversationClient<{
        user: {
            name: string;
            id: string;
        };
        tour: {
            id: string;
            title: string;
            coverImageUrl: string;
        };
        messages: ({
            sender: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            type: import(".prisma/client").$Enums.MessageType;
            content: string;
            isRead: boolean;
        })[];
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
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findManyForUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            name: string;
            id: string;
        };
        tour: {
            id: string;
            title: string;
            coverImageUrl: string;
        };
        messages: ({
            sender: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            type: import(".prisma/client").$Enums.MessageType;
            content: string;
            isRead: boolean;
        })[];
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
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    })[]>;
    findConversationById(id: string): import(".prisma/client").Prisma.Prisma__ConversationClient<{
        user: {
            name: string;
            id: string;
        };
        tour: {
            id: string;
            title: string;
            coverImageUrl: string;
        };
        messages: ({
            sender: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            type: import(".prisma/client").$Enums.MessageType;
            content: string;
            isRead: boolean;
        })[];
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
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findConversationRaw(id: string): import(".prisma/client").Prisma.Prisma__ConversationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateBookingStatus(conversationId: string, status: BookingStatus): import(".prisma/client").Prisma.Prisma__ConversationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    touchConversation(conversationId: string): import(".prisma/client").Prisma.Prisma__ConversationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findMessages(conversationId: string): import(".prisma/client").Prisma.PrismaPromise<({
        sender: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        type: import(".prisma/client").$Enums.MessageType;
        content: string;
        isRead: boolean;
    })[]>;
    markMessagesRead(conversationId: string, readerId: string): Promise<number>;
    createMessage(data: {
        conversationId: string;
        senderId: string;
        content: string;
        type: MessageType;
    }): import(".prisma/client").Prisma.Prisma__MessageClient<{
        sender: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        type: import(".prisma/client").$Enums.MessageType;
        content: string;
        isRead: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private conversationInclude;
}
