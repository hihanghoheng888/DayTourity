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
exports.BookingsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const bookingSummaryInclude = {
    tour: {
        select: { id: true, title: true, city: true, coverImageUrl: true },
    },
    guide: {
        select: { id: true, name: true },
    },
};
const guideBookingInclude = {
    tour: {
        select: { id: true, title: true, city: true, coverImageUrl: true },
    },
    traveller: {
        select: { id: true, name: true },
    },
};
let BookingsRepository = class BookingsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findConversationWithBooking(conversationId) {
        return this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { booking: true },
        });
    }
    createBooking(data) {
        return this.prisma.booking.create({
            data,
            include: bookingSummaryInclude,
        });
    }
    findManyByTraveller(travellerId, statusFilter) {
        return this.prisma.booking.findMany({
            where: {
                travellerId,
                status: { in: statusFilter },
            },
            orderBy: [{ status: 'asc' }, { scheduledDate: 'asc' }],
            include: bookingSummaryInclude,
        });
    }
    findManyByGuide(guideId) {
        return this.prisma.booking.findMany({
            where: { guideId },
            orderBy: [{ status: 'asc' }, { scheduledDate: 'asc' }],
            include: guideBookingInclude,
        });
    }
    findActiveByTourAndTraveller(tourId, travellerId) {
        return this.prisma.booking.findFirst({
            where: {
                tourId,
                travellerId,
                status: { in: [client_1.TourStatus.PLANNED, client_1.TourStatus.ONGOING] },
            },
        });
    }
    findBookingById(bookingId) {
        return this.prisma.booking.findUnique({ where: { id: bookingId } });
    }
    updateStatus(bookingId, data) {
        return this.prisma.booking.update({
            where: { id: bookingId },
            data,
        });
    }
};
exports.BookingsRepository = BookingsRepository;
exports.BookingsRepository = BookingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsRepository);
//# sourceMappingURL=bookings.repository.js.map