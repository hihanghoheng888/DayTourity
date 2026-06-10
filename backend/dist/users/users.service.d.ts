import { PricePreference, User } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { BecomeGuideDto } from './dto/become-guide.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<User>;
    updatePreferences(userId: string, pricePreference: PricePreference): Promise<Pick<User, 'id' | 'email' | 'name' | 'role' | 'pricePreference'>>;
    becomeGuide(userId: string, dto: BecomeGuideDto): Promise<Pick<User, 'id' | 'email' | 'name' | 'role' | 'pricePreference'>>;
    findPendingGuides(): Promise<Pick<User, 'id' | 'name' | 'email' | 'phone' | 'createdAt'>[]>;
    approveGuide(userId: string): Promise<Pick<User, 'id' | 'email' | 'name' | 'role' | 'pricePreference'>>;
    rejectGuide(userId: string): Promise<Pick<User, 'id' | 'email' | 'name' | 'role' | 'pricePreference'>>;
}
