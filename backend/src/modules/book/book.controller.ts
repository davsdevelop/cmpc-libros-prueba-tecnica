import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, HttpCode, Res } from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Response } from 'express';
import { ApiTags } from "@nestjs/swagger";
import { FindAllBooksDto } from "./dto/findAll-book.dto";

@ApiTags('Books')
@Controller('books')

export class BookController {

    constructor(
        private readonly bookService: BookService
    ) {}

    
    @Get('/health')
    health(){
        return this.bookService.healthModule()
    }

    // POST CREATE
    @Post()
    createBook( @Body() createBookDto: CreateBookDto){
        return this.bookService.createBook(createBookDto)
    }

    // GET FIND ALL
    @Get()
    findAllBooks(@Query() findAllBooksDto: FindAllBooksDto){
        return this.bookService.findAllBook(findAllBooksDto)
    }

    // PATCH UPDATE 
    @Patch(':id')
    updateBook(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateBookDto: UpdateBookDto
    ) {
        return this.bookService.updateBook(id, updateBookDto)
    }


    // DELETE
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteBook(
        @Param('id', ParseIntPipe) id: number, 
    ){
        return this.bookService.removeBook(id)
    }

    // EXPORT CSV
    @Get('export/csv')
    async exportCsv(@Res() res: Response) {
        const csvData = await this.bookService.exportBooksToCsv();
        
        res.header('Content-Type', 'text/csv');
        res.attachment('libros_cmpc.csv');
        
        return res.send(csvData);
    }






    


}