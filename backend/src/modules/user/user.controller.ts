import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, HttpCode } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')

export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    
    @Get('/health')
    health(){
        return this.userService.healthModule()
    }

    // POST CREATE
    @Post()
    createUser( @Body() createUserDto: CreateUserDto){
        return this.userService.createUser(createUserDto)
    }

    // GET FIND ALL
    @Get()
    findAllUser(){
        return this.userService.findAllUser()
    }

    // GET FIND BY TITLE
    @Get('/findbyId/:id')
    findByTitle(@Param('id', ParseIntPipe) id: number){
        return this.userService.findById(id)
    }

    // PATCH UPDATE 
    @Patch(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.updateUser(id, updateUserDto)
    }

    // DELETE
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(
        @Param('id', ParseIntPipe) id: number, 
    ){
        return this.userService.removeUser(id)
    }






    


}