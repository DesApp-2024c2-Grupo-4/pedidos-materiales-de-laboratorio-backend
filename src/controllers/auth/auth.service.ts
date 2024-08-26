import { Injectable } from "@nestjs/common";
import MongooseDriver from "../../db/drivers/mongoose.driver";


@Injectable()
export default class AuthService{

    constructor(private readonly db:MongooseDriver){}

    public registerUser(){
        this.db.
    }
}