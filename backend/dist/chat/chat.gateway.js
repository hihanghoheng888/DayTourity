"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(chatService, jwtService, configService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async handleConnection(client) {
        try {
            const token = this.extractToken(client);
            const payload = this.jwtService.verify(token, {
                secret: this.configService.getOrThrow('JWT_SECRET'),
            });
            client.userId = payload.sub;
            client.emit('connected', { userId: client.userId });
        }
        catch {
            client.emit('error', { message: 'Unauthorized' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinRoom(client, data) {
        try {
            await this.chatService.getConversation(data.conversationId, client.userId);
            await client.join(data.conversationId);
            client.emit('room_joined', { conversationId: data.conversationId });
            const count = await this.chatService.markMessagesRead(data.conversationId, client.userId);
            if (count > 0) {
                this.server.to(data.conversationId).emit('messages_read', {
                    conversationId: data.conversationId,
                    readBy: client.userId,
                });
            }
        }
        catch {
            throw new websockets_1.WsException('Cannot join room: access denied or not found');
        }
    }
    async handleMarkRead(client, data) {
        const count = await this.chatService.markMessagesRead(data.conversationId, client.userId);
        if (count > 0) {
            this.server.to(data.conversationId).emit('messages_read', {
                conversationId: data.conversationId,
                readBy: client.userId,
            });
        }
    }
    handleLeaveRoom(client, data) {
        client.leave(data.conversationId);
    }
    async handleSendMessage(client, data) {
        try {
            await this.chatService.getConversation(data.conversationId, client.userId);
            const message = await this.chatService.saveMessage({
                conversationId: data.conversationId,
                senderId: client.userId,
                content: data.content,
                type: data.type ?? 'TEXT',
            });
            this.server.to(data.conversationId).emit('new_message', message);
            return { success: true };
        }
        catch {
            throw new websockets_1.WsException('Failed to send message');
        }
    }
    async handleSendItinerary(client, data) {
        try {
            const conv = await this.chatService.getConversationRaw(data.conversationId);
            if (!conv)
                throw new websockets_1.WsException('Conversation not found');
            if (conv.guideId !== client.userId) {
                throw new websockets_1.WsException('Only the guide can send itinerary proposals');
            }
            const message = await this.chatService.saveMessage({
                conversationId: data.conversationId,
                senderId: client.userId,
                content: JSON.stringify(data.proposal),
                type: 'ITINERARY_PROPOSAL',
            });
            await this.chatService.setBookingStatus(data.conversationId, 'PROPOSED');
            this.server.to(data.conversationId).emit('new_message', message);
            this.server.to(data.conversationId).emit('status_changed', {
                conversationId: data.conversationId,
                status: 'PROPOSED',
            });
            return { success: true };
        }
        catch (e) {
            throw new websockets_1.WsException(e instanceof websockets_1.WsException ? e.message : 'Failed to send itinerary proposal');
        }
    }
    handleTyping(client, data) {
        client.to(data.conversationId).emit('typing', {
            userId: client.userId,
            isTyping: data.isTyping,
        });
    }
    emitStatusChanged(conversationId, status) {
        this.server
            .to(conversationId)
            .emit('status_changed', { conversationId, status });
    }
    extractToken(client) {
        const authHeader = client.handshake.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            return authHeader.slice(7);
        }
        const queryToken = client.handshake.auth?.token;
        if (queryToken)
            return queryToken;
        throw new Error('No token provided');
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_itinerary'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendItinerary", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: 'chat',
    }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_service_1.ChatService))),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map