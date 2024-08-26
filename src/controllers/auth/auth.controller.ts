import { Controller, Inject, Post } from "@nestjs/common";
import AuthService from "./auth.service";


@Controller('/auth')
export default class AuthController{
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('/register')
    registerUser(){
        
    }

}