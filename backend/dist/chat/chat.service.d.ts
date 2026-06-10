import { BookingStatus } from '@prisma/client';
import { ChatRepository } from './chat.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ChatGateway } from './chat.gateway';
export declare class ChatService {
    private readonly chatRepository;
    private readonly gateway;
    constructor(chatRepository: ChatRepository, gateway: ChatGateway);
    findOrCreateConversation(userId: string, dto: CreateConversationDto): Promise<{
        id: any;
        bookingStatus: any;
        user: any;
        guide: any;
        tour: any;
        lastMessage: any;
        createdAt: any;
        updatedAt: any;
    }>;
    listConversations(userId: string): Promise<{
        id: any;
        bookingStatus: any;
        user: any;
        guide: any;
        tour: any;
        lastMessage: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    getConversation(id: string, userId: string): Promise<{
        id: any;
        bookingStatus: any;
        user: any;
        guide: any;
        tour: any;
        lastMessage: any;
        createdAt: any;
        updatedAt: any;
    }>;
    getConversationRaw(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }>;
    setBookingStatus(conversationId: string, status: BookingStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }>;
    acceptProposal(conversationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }>;
    getMessages(conversationId: string, userId: string): Promise<({
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
    saveMessage(data: {
        conversationId: string;
        senderId: string;
        content: string;
        type?: 'TEXT' | 'ITINERARY_PROPOSAL';
    }): Promise<{
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
    }>;
    private serializeConversation;
}
