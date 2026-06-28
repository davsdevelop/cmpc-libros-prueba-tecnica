import { Module } from "@nestjs/common";
import { HashingService } from "./hashing/hashing.service";
import { BcryptService } from "./hashing/bcrypt.service";
import { AuthenticationService } from "./authentication/authentication.service";
import { AuthenticationController } from "./authentication/authentication.controller";
import { PrismaModule } from "../../config/db/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "../../config/security/jwt.config";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./authentication/guards/access-token.guard";
import { AuthenticationGuard } from "./authentication/guards/authentication.guard";


@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
        ...jwtConfig.asProvider(),
        useFactory: (config: ConfigType<typeof jwtConfig>) => {
            return {
                secret: config.secret,
                signOptions: {
                    expiresIn: '1h',
                },
            };
        },
        inject: [jwtConfig.KEY],
    }),
        ConfigModule.forFeature(jwtConfig),
    ],
    providers: [
        {
            provide: HashingService, 
            useClass: BcryptService
        },
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        AccessTokenGuard,
        AuthenticationService,
    ],
    controllers: [AuthenticationController],
})

export class IamModule {}