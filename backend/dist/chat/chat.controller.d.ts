import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { RequestUser } from '../auth/decorators/current-user.decorator';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    list(user: RequestUser): Promise<{
        id: any;
        bookingStatus: any;
        user: any;
        guide: any;
        tour: any;
        lastMessage: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    findOrCreate(user: RequestUser, dto: CreateConversationDto): Promise<{
        id: any;
        bookingStatus: any;
        user: any;
        guide: any;
        tour: any;
        lastMessage: any;
        createdAt: any;
        updatedAt: any;
    }>;
    getOne(id: string, user: RequestUser): Promise<{
        id: any;
        bookingStatus: any;
        user: any;
        guide: any;
        tour: any;
        lastMessage: any;
        createdAt: any;
        updatedAt: any;
    }>;
    getMessages(id: string, user: RequestUser): Promise<({
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
    acceptProposal(id: string, user: RequestUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        guideId: string;
        tourId: string;
        userId: string;
        bookingStatus: import(".prisma/client").$Enums.BookingStatus;
    }>;
}
