import { PrismaService } from '../prisma/prisma.service';
export declare class HealthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    pingDatabase(): Promise<void>;
}
