import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Types } from 'mongoose';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/:id')
  getConversationById(@Param('id') id: Types.ObjectId) {
    return this.conversationService.getConversationById(id);
  }

  @Post('/:id')
  addMessage(
    @Param('id') id: Types.ObjectId,
    @Body('ownerId') ownerId: Types.ObjectId,
    @Body('message') content: string,
  ) {
    this.conversationService.addMessage(id, ownerId, content);
  }
}
