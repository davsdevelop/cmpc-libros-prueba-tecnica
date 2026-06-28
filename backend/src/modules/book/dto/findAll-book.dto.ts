import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";


export class FindAllBooksDto extends PaginationDto {

    @IsOptional() 
    @IsString() 
    readonly title?: string;

    @IsOptional() 
    @IsString() 
    readonly author?: string;

    @IsOptional() 
    @IsString() 
    readonly editorial?: string;

    @IsOptional() 
    @IsString() 
    readonly genre?: string;

    @IsOptional() 
    @IsBoolean() 
    readonly availability?: boolean;

    @IsOptional() 
    @IsString() 
    readonly sortBy?: string;

    @IsOptional() 
    @IsEnum(['asc', 'desc']) 
    readonly order?: 'asc' | 'desc' = 'asc';
}