import { HealthRepository } from './health.repository';
export declare class HealthService {
    private readonly healthRepository;
    constructor(healthRepository: HealthRepository);
    check(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: "error" | "ok";
        };
    }>;
}
