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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const users_repository_1 = require("./users.repository");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    findByEmail(email) {
        return this.usersRepository.findByEmail(email);
    }
    findById(id) {
        return this.usersRepository.findById(id);
    }
    create(data) {
        return this.usersRepository.create(data);
    }
    updatePreferences(userId, pricePreference) {
        return this.usersRepository.updatePreferences(userId, pricePreference);
    }
    async becomeGuide(userId, dto) {
        const user = await this.usersRepository.findRoleById(userId);
        if (user.role === client_1.Role.PENDING_GUIDE) {
            throw new common_1.ConflictException('Your application is already under review.');
        }
        if (user.role === client_1.Role.GUIDE) {
            throw new common_1.ConflictException('You are already a verified guide.');
        }
        return this.usersRepository.applyForGuide(userId, dto.phone);
    }
    findPendingGuides() {
        return this.usersRepository.findPendingGuides();
    }
    async approveGuide(userId) {
        const user = await this.usersRepository.findRoleById(userId);
        if (user.role !== client_1.Role.PENDING_GUIDE) {
            throw new common_1.ConflictException('This user has no pending application.');
        }
        return this.usersRepository.updateRole(userId, client_1.Role.GUIDE);
    }
    async rejectGuide(userId) {
        const user = await this.usersRepository.findRoleById(userId);
        if (user.role !== client_1.Role.PENDING_GUIDE) {
            throw new common_1.ConflictException('This user has no pending application.');
        }
        return this.usersRepository.updateRole(userId, client_1.Role.USER);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map