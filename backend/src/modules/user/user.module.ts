import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../../config/db/prisma.module";
import { HashingService } from "../iam/hashing/hashing.service";
import { BcryptService } from "../iam/hashing/bcrypt.service";


@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [
        {
            provide: HashingService, 
            useClass: BcryptService
        },
        UserService
    ],
    exports: [UserService]
})

export class UserModule {}