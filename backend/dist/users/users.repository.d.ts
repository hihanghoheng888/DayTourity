import { PrismaService } from '../prisma/prisma.service';
import { PricePreference, Role, User } from '@prisma/client';
type UserSummary = Pick<User, 'id' | 'email' | 'name' | 'role' | 'pricePreference'>;
export declare class UsersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<User>;
    updatePreferences(userId: string, pricePreference: PricePreference): Promise<UserSummary>;
    findRoleById(userId: string): Promise<Pick<User, 'role'>>;
    updateRole(userId: string, role: Role): Promise<UserSummary>;
    applyForGuide(userId: string, phone: string): Promise<UserSummary>;
    findPendingGuides(): Promise<Pick<User, 'id' | 'name' | 'email' | 'phone' | 'createdAt'>[]>;
}
export {};
