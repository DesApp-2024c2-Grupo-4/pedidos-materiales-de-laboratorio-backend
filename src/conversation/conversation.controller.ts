import { Controller, Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/:id')
  getConversationById(@Param('id') id: string) {
    return this.conversationService.getConversationById(id);
  }
}
