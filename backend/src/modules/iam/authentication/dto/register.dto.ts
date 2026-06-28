import { IsEmail, IsString, Min, MinLength } from "class-validator";

export class RegisterDto {

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string


}