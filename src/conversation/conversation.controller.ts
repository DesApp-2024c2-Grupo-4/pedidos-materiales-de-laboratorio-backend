import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Types } from 'mongoose';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/types/jwt-payload';

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
    @Req() req: Request & { auth: AccessTokenPayload },
    @Body('message') content: string,
  ) {
    const { id: ownerId } = req.auth;
    this.conversationService.addMessage(id, ownerId, content);
  }
}
