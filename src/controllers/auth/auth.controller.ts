import { Controller, Inject, Post } from "@nestjs/common";
import { DatabaseModule } from "./auth.module";


@Controller('/auth')
export default class AuthController{
    constructor(
        RegisterService
    ){}

    @Post('/register')
    registerUser(){
        
    }

}