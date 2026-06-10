import { CreateActivityDto } from './create-tour.dto';
export declare class UpdateTourDto {
    title?: string;
    description?: string;
    city?: string;
    basePrice?: number;
    coverImageUrl?: string;
    availableDates?: string[];
    activities?: CreateActivityDto[];
}
