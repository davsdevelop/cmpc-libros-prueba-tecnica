import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthType } from "./enums/auth-type.enums";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "./decorators/auth.decorator";

@ApiTags('Authentication')
@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {

    constructor(
        private readonly authenticationService: AuthenticationService
    ){}

    @Post('register')
    registerUser(@Body() registerDto: RegisterDto){
        return this.authenticationService.Register(registerDto)
    }


    @Post('login')
    loginUser(@Body() loginDto: LoginDto){
        return this.authenticationService.login(loginDto)
    }
}