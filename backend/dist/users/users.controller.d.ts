import { UsersService } from './users.service';
import { RequestUser } from '../auth/decorators/current-user.decorator';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { BecomeGuideDto } from './dto/become-guide.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: RequestUser): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        pricePreference: import(".prisma/client").$Enums.PricePreference;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPendingGuides(): Promise<Pick<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        pricePreference: import(".prisma/client").$Enums.PricePreference;
        createdAt: Date;
        updatedAt: Date;
    }, "name" | "id" | "email" | "phone" | "createdAt">[]>;
    updatePreferences(user: RequestUser, dto: UpdatePreferencesDto): Promise<Pick<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        pricePreference: import(".prisma/client").$Enums.PricePreference;
        createdAt: Date;
        updatedAt: Date;
    }, "name" | "id" | "email" | "role" | "pricePreference">>;
    becomeGuide(user: RequestUser, dto: BecomeGuideDto): Promise<Pick<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        pricePreference: import(".prisma/client").$Enums.PricePreference;
        createdAt: Date;
        updatedAt: Date;
    }, "name" | "id" | "email" | "role" | "pricePreference">>;
    approveGuide(id: string): Promise<Pick<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        pricePreference: import(".prisma/client").$Enums.PricePreference;
        createdAt: Date;
        updatedAt: Date;
    }, "name" | "id" | "email" | "role" | "pricePreference">>;
    rejectGuide(id: string): Promise<Pick<{
        name: string;
        id: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        pricePreference: import(".prisma/client").$Enums.PricePreference;
        createdAt: Date;
        updatedAt: Date;
    }, "name" | "id" | "email" | "role" | "pricePreference">>;
}
