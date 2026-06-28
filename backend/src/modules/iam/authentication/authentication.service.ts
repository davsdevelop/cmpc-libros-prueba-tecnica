import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { HashingService } from "../hashing/hashing.service";
import { PrismaService } from "../../../config/db/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../../../config/security/jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class AuthenticationService {

    constructor(
        private prisma: PrismaService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
        
    ){}


    async Register(registerDto: RegisterDto){
    
        const user = await this.prisma.user.findUnique({
            where: { email: registerDto.email }
        });

        if (user) {
            throw new ConflictException(`El email "${registerDto.email}" ya está registrado`);
        }
        
        return this.prisma.user.create(
            {
                data: {
                    email: registerDto.email,
                    password: await this.hashingService.hash(registerDto.password)
                }
            }
        )
    }



    async login(loginDto: LoginDto){
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email }
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales Inválidas');
        }
        const isEqual = await this.hashingService.compare(
            loginDto.password,
            user.password
        )
        if(!isEqual){
            throw new UnauthorizedException('Credenciales Inválidas')
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
            },
            {
                secret: this.jwtConfiguration.secret
            }
        )

        return {
            message: "Login Correcto!",
            token: accessToken
        }
    }

}