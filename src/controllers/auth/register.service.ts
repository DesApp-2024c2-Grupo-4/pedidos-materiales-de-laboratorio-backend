import { Inject, Injectable } from '@nestjs/common';
import { DatabaseModule } from '../../db/drivers/mongoose.module';

@Injectable()
export default class RegisterService {

    constructor(
        @Inject("DATABASE")
        private readonly db:DatabaseModule
    ){}

    registerUser(){

    }
}
