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
exports.ToursController = void 0;
const common_1 = require("@nestjs/common");
const tours_service_1 = require("./tours.service");
const get_tours_query_dto_1 = require("./dto/get-tours-query.dto");
const create_tour_dto_1 = require("./dto/create-tour.dto");
const update_tour_dto_1 = require("./dto/update-tour.dto");
const add_photo_dto_1 = require("./dto/add-photo.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ToursController = class ToursController {
    constructor(toursService) {
        this.toursService = toursService;
    }
    getRecommended(query) {
        return this.toursService.getRecommended(query);
    }
    findById(id) {
        return this.toursService.findById(id);
    }
    create(user, dto) {
        return this.toursService.create(user.userId, dto);
    }
    update(id, user, dto) {
        return this.toursService.updateTour(id, user.userId, dto);
    }
    deleteTour(id, user) {
        return this.toursService.deleteTour(id, user.userId);
    }
    addPhoto(tourId, user, dto) {
        return this.toursService.addPhoto(tourId, user.userId, dto.url);
    }
    removePhoto(tourId, photoId, user) {
        return this.toursService.removePhoto(tourId, photoId, user.userId);
    }
};
exports.ToursController = ToursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_tours_query_dto_1.GetToursQueryDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "getRecommended", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('GUIDE'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_tour_dto_1.CreateTourDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('GUIDE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_tour_dto_1.UpdateTourDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('GUIDE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "deleteTour", null);
__decorate([
    (0, common_1.Post)(':id/photos'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('GUIDE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, add_photo_dto_1.AddPhotoDto]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Delete)(':id/photos/:photoId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('GUIDE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('photoId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ToursController.prototype, "removePhoto", null);
exports.ToursController = ToursController = __decorate([
    (0, common_1.Controller)('tours'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tours_service_1.ToursService])
], ToursController);
//# sourceMappingURL=tours.controller.js.map