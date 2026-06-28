import { Module } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { PrismaModule } from "../../config/db/prisma.module";


@Module({
    imports: [PrismaModule],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})

export class BookModule {}