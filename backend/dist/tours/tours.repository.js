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
exports.ToursRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tourInclude = {
    activities: { orderBy: { order: 'asc' } },
    guide: { select: { id: true, name: true, email: true } },
    photos: { orderBy: { order: 'asc' } },
};
let ToursRepository = class ToursRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findManyActive(where) {
        return this.prisma.tour.findMany({
            where,
            include: tourInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    findByIdWithDetails(id) {
        return this.prisma.tour.findUnique({
            where: { id },
            include: tourInclude,
        });
    }
    findById(id) {
        return this.prisma.tour.findUnique({ where: { id } });
    }
    create(data) {
        return this.prisma.tour.create({
            data,
            include: tourInclude,
        });
    }
    update(id, data) {
        return this.prisma.tour.update({
            where: { id },
            data,
            include: tourInclude,
        });
    }
    delete(id) {
        return this.prisma.tour.delete({ where: { id } });
    }
    findLastPhoto(tourId) {
        return this.prisma.tourPhoto.findFirst({
            where: { tourId },
            orderBy: { order: 'desc' },
        });
    }
    createPhoto(data) {
        return this.prisma.tourPhoto.create({ data });
    }
    findPhotoById(photoId) {
        return this.prisma.tourPhoto.findUnique({ where: { id: photoId } });
    }
    deletePhoto(photoId) {
        return this.prisma.tourPhoto.delete({ where: { id: photoId } });
    }
};
exports.ToursRepository = ToursRepository;
exports.ToursRepository = ToursRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ToursRepository);
//# sourceMappingURL=tours.repository.js.map