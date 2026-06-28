import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    readonly title!: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    readonly author!: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    readonly editorial!: string;

    @IsNumber()
    @IsPositive()
    readonly price!: number;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    readonly genre!: string;

    @IsString()
    @IsOptional()
    readonly imageUrl?: string;

}


