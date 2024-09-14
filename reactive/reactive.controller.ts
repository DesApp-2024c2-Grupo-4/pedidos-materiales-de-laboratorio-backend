import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ReactiveService } from './reactive.service';
import { Types } from 'mongoose';
import { Reactive } from 'src/schemas/requestable/reactive';


@Controller('/reactive')
export class ReactiveController {
    constructor(private ReactiveService : ReactiveService){}
    
    @Post()
    createReactive(@Body() reactive: Reactive,)
    {
        return this.ReactiveService.createReactive(reactive)
    }

    @Get()
    getReactives()
    {
        return this.ReactiveService.getReactives()
    }


    @Get('/:id')
    getReactive(@Param('Id') ownerId: Types.ObjectId,)
    {
        return this.ReactiveService.getReactiveById(ownerId)
    }

    @Put('/:id')
    updateReactive(@Param('Id') ownerId: Types.ObjectId,@Body() reactive : Reactive)
    {
        return this.ReactiveService.updateReactiveById(ownerId, reactive)
    }


    @Delete('/:id')
    deleteReactive(@Param('Id') ownerId: Types.ObjectId)
    {
        return this.ReactiveService.deleteReactiveById(ownerId)
    }

}