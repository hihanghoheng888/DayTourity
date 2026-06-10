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
exports.ToursService = void 0;
const common_1 = require("@nestjs/common");
const tours_repository_1 = require("./tours.repository");
const pricing_category_service_1 = require("./pricing/pricing-category.service");
let ToursService = class ToursService {
    constructor(toursRepository, pricingService) {
        this.toursRepository = toursRepository;
        this.pricingService = pricingService;
    }
    async getRecommended(query) {
        const whereClause = { isActive: true };
        if (query.city) {
            whereClause.city = { contains: query.city, mode: 'insensitive' };
        }
        const allTours = await this.toursRepository.findManyActive(whereClause);
        const toursWithPrice = allTours.map((tour) => ({
            ...tour,
            totalPrice: this.tourTotal(tour),
        }));
        const prices = toursWithPrice.map((t) => t.totalPrice);
        const thresholds = this.pricingService.computeThresholds(prices);
        const taggedTours = toursWithPrice.map((tour) => ({
            ...tour,
            priceCategory: thresholds
                ? this.pricingService.categorise(tour.totalPrice, thresholds)
                : 'STANDARD',
        }));
        let filtered = taggedTours;
        if (query.priceCategory) {
            const allowed = this.pricingService.preferenceToCategories(query.priceCategory);
            filtered = taggedTours.filter((t) => allowed.includes(t.priceCategory));
        }
        return {
            tours: filtered.map((t) => this.serializeTour(t)),
            meta: {
                city: query.city ?? null,
                priceCategory: query.priceCategory ?? null,
                thresholds: thresholds
                    ? {
                        q1: thresholds.q1,
                        q3: thresholds.q3,
                        iqr: thresholds.iqr,
                        upperFence: thresholds.upperFence,
                    }
                    : null,
            },
        };
    }
    async findById(id) {
        const tour = await this.toursRepository.findByIdWithDetails(id);
        if (!tour)
            throw new common_1.NotFoundException('Tour not found');
        return this.serializeTour({
            ...tour,
            totalPrice: this.tourTotal(tour),
            priceCategory: 'STANDARD',
        });
    }
    async create(guideId, dto) {
        const tour = await this.toursRepository.create({
            title: dto.title,
            description: dto.description,
            city: dto.city,
            basePrice: dto.basePrice ?? 0,
            coverImageUrl: dto.coverImageUrl,
            availableDates: dto.availableDates?.map((d) => new Date(d)) ?? [],
            guideId,
            activities: {
                create: dto.activities.map((act, idx) => ({
                    name: act.name,
                    description: act.description,
                    pricingType: act.pricingType,
                    fixedPrice: act.fixedPrice,
                    minPrice: act.minPrice,
                    maxPrice: act.maxPrice,
                    order: act.order ?? idx,
                })),
            },
            photos: dto.photoUrls?.length
                ? {
                    create: dto.photoUrls.map((url, idx) => ({
                        url,
                        order: idx,
                    })),
                }
                : undefined,
        });
        return this.serializeTour({
            ...tour,
            totalPrice: this.tourTotal(tour),
            priceCategory: 'STANDARD',
        });
    }
    async updateTour(id, guideId, dto) {
        const tour = await this.toursRepository.findById(id);
        if (!tour)
            throw new common_1.NotFoundException('Tour not found');
        if (tour.guideId !== guideId) {
            throw new common_1.ForbiddenException('You can only edit your own tours');
        }
        const updated = await this.toursRepository.update(id, {
            ...(dto.title !== undefined && { title: dto.title }),
            ...(dto.description !== undefined && { description: dto.description }),
            ...(dto.city !== undefined && { city: dto.city }),
            ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
            ...(dto.coverImageUrl !== undefined && {
                coverImageUrl: dto.coverImageUrl,
            }),
            ...(dto.availableDates !== undefined && {
                availableDates: dto.availableDates.map((d) => new Date(d)),
            }),
            ...(dto.activities !== undefined && {
                activities: {
                    deleteMany: {},
                    create: dto.activities.map((act, idx) => ({
                        name: act.name,
                        description: act.description,
                        pricingType: act.pricingType,
                        fixedPrice: act.fixedPrice,
                        minPrice: act.minPrice,
                        maxPrice: act.maxPrice,
                        order: act.order ?? idx,
                    })),
                },
            }),
        });
        return this.serializeTour({
            ...updated,
            totalPrice: this.tourTotal(updated),
            priceCategory: 'STANDARD',
        });
    }
    async deleteTour(id, guideId) {
        const tour = await this.toursRepository.findById(id);
        if (!tour)
            throw new common_1.NotFoundException('Tour not found');
        if (tour.guideId !== guideId) {
            throw new common_1.ForbiddenException('You can only delete your own tours');
        }
        await this.toursRepository.delete(id);
        return { message: 'Tour deleted successfully' };
    }
    async addPhoto(tourId, guideId, url) {
        const tour = await this.toursRepository.findById(tourId);
        if (!tour)
            throw new common_1.NotFoundException('Tour not found');
        if (tour.guideId !== guideId) {
            throw new common_1.ForbiddenException('You can only add photos to your own tours');
        }
        const lastPhoto = await this.toursRepository.findLastPhoto(tourId);
        const nextOrder = lastPhoto ? lastPhoto.order + 1 : 0;
        return this.toursRepository.createPhoto({ tourId, url, order: nextOrder });
    }
    async removePhoto(tourId, photoId, guideId) {
        const tour = await this.toursRepository.findById(tourId);
        if (!tour)
            throw new common_1.NotFoundException('Tour not found');
        if (tour.guideId !== guideId) {
            throw new common_1.ForbiddenException('You can only remove photos from your own tours');
        }
        const photo = await this.toursRepository.findPhotoById(photoId);
        if (!photo || photo.tourId !== tourId) {
            throw new common_1.NotFoundException('Photo not found');
        }
        await this.toursRepository.deletePhoto(photoId);
        return { message: 'Photo removed' };
    }
    computeTourPrice(activities) {
        return activities.reduce((sum, act) => {
            if (act.pricingType === 'FIXED')
                return sum + Number(act.fixedPrice ?? 0);
            const mid = (Number(act.minPrice ?? 0) + Number(act.maxPrice ?? 0)) / 2;
            return sum + mid;
        }, 0);
    }
    tourTotal(tour) {
        return Number(tour.basePrice ?? 0) + this.computeTourPrice(tour.activities);
    }
    serializeTour(tour) {
        return {
            id: tour.id,
            title: tour.title,
            description: tour.description,
            city: tour.city,
            basePrice: tour.basePrice != null ? Number(tour.basePrice) : 0,
            coverImageUrl: tour.coverImageUrl ?? null,
            isActive: tour.isActive,
            availableDates: (tour.availableDates ?? []).map((d) => d instanceof Date ? d.toISOString() : d),
            photos: (tour.photos ?? []).map((p) => ({
                id: p.id,
                url: p.url,
                order: p.order,
            })),
            totalPrice: tour.totalPrice,
            priceCategory: tour.priceCategory,
            guide: tour.guide,
            activities: tour.activities.map((act) => ({
                id: act.id,
                name: act.name,
                description: act.description,
                pricingType: act.pricingType,
                fixedPrice: act.fixedPrice ? Number(act.fixedPrice) : null,
                minPrice: act.minPrice ? Number(act.minPrice) : null,
                maxPrice: act.maxPrice ? Number(act.maxPrice) : null,
                order: act.order,
            })),
            createdAt: tour.createdAt,
        };
    }
};
exports.ToursService = ToursService;
exports.ToursService = ToursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tours_repository_1.ToursRepository,
        pricing_category_service_1.PricingCategoryService])
], ToursService);
//# sourceMappingURL=tours.service.js.map