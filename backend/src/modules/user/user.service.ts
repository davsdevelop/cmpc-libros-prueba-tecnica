import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../config/db/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { HashingService } from "../iam/hashing/hashing.service";


@Injectable()
export class UserService {

    constructor(
        private prisma: PrismaService,
        private readonly hashingService: HashingService
    ) {}

    // HEALTH DEL MODULO USER
    healthModule(){
        return {message: "Modulo User OK!"}
    };


    // CREATE USER
    async createUser(dto: CreateUserDto){
        
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (exists) {
            throw new ConflictException(`El email "${dto.email}" ya está registrado`);
        }

        return this.prisma.user.create(
            {
                data: {
                    email: dto.email,
                    password: await this.hashingService.hash(dto.password)
                }
            }
        )
    };


    // FIND ALL USER
    async findAllUser(){
        
        return this.prisma.user.findMany({
            where: { deletedAt: null }
        })      
    };


    // FIND ONE USER BY TITLE
    async findById(id: number){

        const user =  await this.prisma.user.findUnique({
            where: {id}
        });

        if (!user){
            throw new NotFoundException(`No se encontro el usuario`)
        }

        return user
    };


    // UPDATE USER
    async updateUser(id: number, updateUserDto: UpdateUserDto){

        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user){
            throw new NotFoundException(`No se encontro el usuario`)
        }

        const dataToUpdate: any = { ...updateUserDto };

        if (updateUserDto.password) {
            dataToUpdate.password = await this.hashingService.hash(updateUserDto.password);
        }

        return await this.prisma.user.update({
            where: { id },
            data: dataToUpdate
        });
    };




    //DELETE USER
    async removeUser(id: number){

        const user =  await this.prisma.user.findUnique({
            where: {id}
        });

        if (!user){
            throw new NotFoundException(`No se encontro el Usuario`)
        }

        return await this.prisma.user.update({
            where: {id},
            data: { 
                deletedAt: new Date(),
            }
        });
    };


    

}