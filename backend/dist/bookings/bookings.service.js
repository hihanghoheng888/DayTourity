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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bookings_repository_1 = require("./bookings.repository");
const tours_service_1 = require("../tours/tours.service");
const ACTIVE_STATUSES = [client_1.TourStatus.PLANNED, client_1.TourStatus.ONGOING];
let BookingsService = class BookingsService {
    constructor(bookingsRepository, toursService) {
        this.bookingsRepository = bookingsRepository;
        this.toursService = toursService;
    }
    async reserve(travellerId, dto) {
        const tour = await this.toursService.findById(dto.tourId);
        if (tour.guide.id === travellerId) {
            throw new common_1.ForbiddenException('You cannot reserve your own tour.');
        }
        const existing = await this.bookingsRepository.findActiveByTourAndTraveller(dto.tourId, travellerId);
        if (existing) {
            throw new common_1.ConflictException('You already have an active reservation for this tour.');
        }
        return this.bookingsRepository.createBooking({
            tourId: dto.tourId,
            travellerId,
            guideId: tour.guide.id,
            scheduledDate: new Date(dto.scheduledDate),
            agreedPrice: tour.totalPrice,
            notes: dto.notes,
            status: client_1.TourStatus.PLANNED,
        });
    }
    async getGuideBookings(guideId) {
        const bookings = await this.bookingsRepository.findManyByGuide(guideId);
        return { data: bookings, total: bookings.length };
    }
    async cancelBooking(bookingId, travellerId) {
        const booking = await this.bookingsRepository.findBookingById(bookingId);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        if (booking.travellerId !== travellerId) {
            throw new common_1.ForbiddenException('This is not your reservation.');
        }
        if (booking.status !== client_1.TourStatus.PLANNED) {
            throw new common_1.ConflictException('Only upcoming reservations can be cancelled.');
        }
        const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
        const msUntilTour = booking.scheduledDate.getTime() - Date.now();
        if (msUntilTour < THREE_DAYS_MS) {
            throw new common_1.ForbiddenException('Cancellation is only allowed up to 3 days before the tour.');
        }
        return this.bookingsRepository.updateStatus(bookingId, {
            status: client_1.TourStatus.CANCELLED,
        });
    }
    async createBooking(travellerId, dto) {
        const conversation = await this.bookingsRepository.findConversationWithBooking(dto.conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation tidak ditemukan.');
        }
        if (conversation.userId !== travellerId) {
            throw new common_1.ForbiddenException('Bukan conversation Anda.');
        }
        if (conversation.bookingStatus !== 'PAID') {
            throw new common_1.ConflictException('Conversation harus berstatus PAID sebelum booking dibuat.');
        }
        if (conversation.booking) {
            throw new common_1.ConflictException('Booking untuk conversation ini sudah ada.');
        }
        return this.bookingsRepository.createBooking({
            conversationId: dto.conversationId,
            tourId: conversation.tourId,
            travellerId: travellerId,
            guideId: conversation.guideId,
            scheduledDate: new Date(dto.scheduledDate),
            agreedPrice: dto.agreedPrice,
            notes: dto.notes,
            status: client_1.TourStatus.PLANNED,
        });
    }
    async getMyTours(travellerId, query) {
        const statusFilter = query.status ? [query.status] : ACTIVE_STATUSES;
        const bookings = await this.bookingsRepository.findManyByTraveller(travellerId, statusFilter);
        return {
            data: bookings,
            total: bookings.length,
        };
    }
    async startTour(bookingId, guideId) {
        const booking = await this._findAndAuthorizeGuide(bookingId, guideId);
        if (booking.status !== client_1.TourStatus.PLANNED) {
            throw new common_1.ConflictException('Hanya tur berstatus PLANNED yang bisa dimulai.');
        }
        return this.bookingsRepository.updateStatus(bookingId, {
            status: client_1.TourStatus.ONGOING,
            startedAt: new Date(),
        });
    }
    async completeTour(bookingId, guideId) {
        const booking = await this._findAndAuthorizeGuide(bookingId, guideId);
        if (booking.status !== client_1.TourStatus.ONGOING) {
            throw new common_1.ConflictException('Hanya tur berstatus ONGOING yang bisa diselesaikan.');
        }
        return this.bookingsRepository.updateStatus(bookingId, {
            status: client_1.TourStatus.COMPLETED,
            completedAt: new Date(),
        });
    }
    async _findAndAuthorizeGuide(bookingId, guideId) {
        const booking = await this.bookingsRepository.findBookingById(bookingId);
        if (!booking)
            throw new common_1.NotFoundException('Booking tidak ditemukan.');
        if (booking.guideId !== guideId)
            throw new common_1.ForbiddenException('Bukan booking Anda.');
        return booking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bookings_repository_1.BookingsRepository,
        tours_service_1.ToursService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map