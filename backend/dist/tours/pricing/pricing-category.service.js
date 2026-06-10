"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingCategoryService = void 0;
const common_1 = require("@nestjs/common");
let PricingCategoryService = class PricingCategoryService {
    computeThresholds(prices) {
        if (prices.length < 4)
            return null;
        const sorted = [...prices].sort((a, b) => a - b);
        const q1 = this.percentile(sorted, 25);
        const q3 = this.percentile(sorted, 75);
        const iqr = q3 - q1;
        return {
            q1,
            q3,
            iqr,
            lowerFence: q1 - 1.5 * iqr,
            upperFence: q3 + 1.5 * iqr,
        };
    }
    categorise(price, thresholds) {
        if (price > thresholds.upperFence)
            return 'OUTLIER';
        if (price > thresholds.q3)
            return 'PREMIUM';
        if (price > thresholds.q1)
            return 'STANDARD';
        return 'BUDGET';
    }
    preferenceToCategories(preference) {
        const map = {
            BUDGET: ['BUDGET'],
            STANDARD: ['STANDARD'],
            PREMIUM: ['PREMIUM', 'OUTLIER'],
        };
        return map[preference];
    }
    percentile(sorted, p) {
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }
};
exports.PricingCategoryService = PricingCategoryService;
exports.PricingCategoryService = PricingCategoryService = __decorate([
    (0, common_1.Injectable)()
], PricingCategoryService);
//# sourceMappingURL=pricing-category.service.js.map