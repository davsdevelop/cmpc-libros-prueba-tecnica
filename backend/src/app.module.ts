import { Module } from '@nestjs/common';
import { PrismaModule } from './config/db/prisma.module';
import { BookModule } from './modules/book/book.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user/user.module';
import { IamModule } from './modules/iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/security/jwt.config';


@Module({
  
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig]
    }),
    PrismaModule,
    BookModule,
    UserModule,
    IamModule,
    CommonModule
  ],
})
export class AppModule {}
