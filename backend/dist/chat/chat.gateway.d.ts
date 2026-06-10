import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
interface AuthSocket extends Socket {
    userId: string;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly jwtService;
    private readonly configService;
    server: Server;
    constructor(chatService: ChatService, jwtService: JwtService, configService: ConfigService);
    handleConnection(client: AuthSocket): Promise<void>;
    handleDisconnect(client: AuthSocket): void;
    handleJoinRoom(client: AuthSocket, data: {
        conversationId: string;
    }): Promise<void>;
    handleMarkRead(client: AuthSocket, data: {
        conversationId: string;
    }): Promise<void>;
    handleLeaveRoom(client: AuthSocket, data: {
        conversationId: string;
    }): void;
    handleSendMessage(client: AuthSocket, data: {
        conversationId: string;
        content: string;
        type?: 'TEXT' | 'ITINERARY_PROPOSAL';
    }): Promise<{
        success: boolean;
    }>;
    handleSendItinerary(client: AuthSocket, data: {
        conversationId: string;
        proposal: Record<string, unknown>;
    }): Promise<{
        success: boolean;
    }>;
    handleTyping(client: AuthSocket, data: {
        conversationId: string;
        isTyping: boolean;
    }): void;
    emitStatusChanged(conversationId: string, status: string): void;
    private extractToken;
}
export {};
