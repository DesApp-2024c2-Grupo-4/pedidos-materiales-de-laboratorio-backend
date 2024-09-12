import { Module } from '@nestjs/common';
import { ReactiveController } from './reactive.controller';
import { ReactiveService } from './reactive.service'
import { MongooseModule } from '@nestjs/mongoose';
import { Reactive ,ReactiveSchema } from 'src/schemas/requestable/reactive';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Reactive.name, 
                                            schema: ReactiveSchema }]),],
    controllers: [ReactiveController],
    providers: [ReactiveService],
})
export class ReactiveModule {};