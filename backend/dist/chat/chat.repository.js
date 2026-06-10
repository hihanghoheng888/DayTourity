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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const senderSelect = { sender: { select: { id: true, name: true } } };
let ChatRepository = class ChatRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findConversationByParticipants(userId, guideId, tourId) {
        return this.prisma.conversation.findUnique({
            where: { userId_guideId_tourId: { userId, guideId, tourId } },
            include: this.conversationInclude(),
        });
    }
    createConversation(data) {
        return this.prisma.conversation.create({
            data,
            include: this.conversationInclude(),
        });
    }
    findManyForUser(userId) {
        return this.prisma.conversation.findMany({
            where: { OR: [{ userId }, { guideId: userId }] },
            include: this.conversationInclude(),
            orderBy: { updatedAt: 'desc' },
        });
    }
    findConversationById(id) {
        return this.prisma.conversation.findUnique({
            where: { id },
            include: this.conversationInclude(),
        });
    }
    findConversationRaw(id) {
        return this.prisma.conversation.findUnique({ where: { id } });
    }
    updateBookingStatus(conversationId, status) {
        return this.prisma.conversation.update({
            where: { id: conversationId },
            data: { bookingStatus: status },
        });
    }
    touchConversation(conversationId) {
        return this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
    }
    findMessages(conversationId) {
        return this.prisma.message.findMany({
            where: { conversationId },
            include: senderSelect,
            orderBy: { createdAt: 'asc' },
        });
    }
    async markMessagesRead(conversationId, readerId) {
        const result = await this.prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: readerId },
                isRead: false,
            },
            data: { isRead: true },
        });
        return result.count;
    }
    createMessage(data) {
        return this.prisma.message.create({
            data,
            include: senderSelect,
        });
    }
    conversationInclude() {
        return {
            user: { select: { id: true, name: true } },
            guide: { select: { id: true, name: true } },
            tour: { select: { id: true, title: true, coverImageUrl: true } },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: senderSelect,
            },
        };
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map