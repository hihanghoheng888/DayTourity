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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const chat_repository_1 = require("./chat.repository");
const chat_gateway_1 = require("./chat.gateway");
let ChatService = class ChatService {
    constructor(chatRepository, gateway) {
        this.chatRepository = chatRepository;
        this.gateway = gateway;
    }
    async findOrCreateConversation(userId, dto) {
        const existing = await this.chatRepository.findConversationByParticipants(userId, dto.guideId, dto.tourId);
        if (existing)
            return this.serializeConversation(existing);
        try {
            const created = await this.chatRepository.createConversation({
                userId,
                guideId: dto.guideId,
                tourId: dto.tourId,
            });
            return this.serializeConversation(created);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2002') {
                const conv = await this.chatRepository.findConversationByParticipants(userId, dto.guideId, dto.tourId);
                if (conv)
                    return this.serializeConversation(conv);
            }
            throw e;
        }
    }
    async listConversations(userId) {
        const rows = await this.chatRepository.findManyForUser(userId);
        return rows.map(this.serializeConversation);
    }
    async getConversation(id, userId) {
        const conv = await this.chatRepository.findConversationById(id);
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        if (conv.userId !== userId && conv.guideId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.serializeConversation(conv);
    }
    async getConversationRaw(id) {
        return this.chatRepository.findConversationRaw(id);
    }
    async setBookingStatus(conversationId, status) {
        return this.chatRepository.updateBookingStatus(conversationId, status);
    }
    async acceptProposal(conversationId, userId) {
        const conv = await this.chatRepository.findConversationRaw(conversationId);
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        if (conv.userId !== userId) {
            throw new common_1.ForbiddenException('Only the user can accept proposals');
        }
        if (conv.bookingStatus !== client_1.BookingStatus.PROPOSED) {
            throw new common_1.BadRequestException('No active proposal to accept');
        }
        const updated = await this.setBookingStatus(conversationId, client_1.BookingStatus.ACCEPTED);
        this.gateway.emitStatusChanged(conversationId, 'ACCEPTED');
        return updated;
    }
    async getMessages(conversationId, userId) {
        await this.getConversation(conversationId, userId);
        return this.chatRepository.findMessages(conversationId);
    }
    markMessagesRead(conversationId, readerId) {
        return this.chatRepository.markMessagesRead(conversationId, readerId);
    }
    async saveMessage(data) {
        await this.chatRepository.touchConversation(data.conversationId);
        return this.chatRepository.createMessage({
            conversationId: data.conversationId,
            senderId: data.senderId,
            content: data.content,
            type: data.type ?? 'TEXT',
        });
    }
    serializeConversation(conv) {
        return {
            id: conv.id,
            bookingStatus: conv.bookingStatus,
            user: conv.user,
            guide: conv.guide,
            tour: conv.tour,
            lastMessage: conv.messages?.[0] ?? null,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
        };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository,
        chat_gateway_1.ChatGateway])
], ChatService);
//# sourceMappingURL=chat.service.js.map