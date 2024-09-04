import { Controller, Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Types } from 'mongoose';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/:id')
  getConversationById(@Param('id') id: Types.ObjectId) {
    return this.conversationService.getConversationById(id);
  }
}
