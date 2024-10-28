import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from '../conversation.controller';
import { ConversationService } from '../conversation.service';
import { Types } from 'mongoose';
import { Request } from 'express';
import { AccessTokenPayload } from '../../types/jwt-payload';

describe('ConversationController', () => {
  let controller: ConversationController;
  let conversationService: any;

  const mockConversationService = {
    get: jest.fn(),
    addMessage: jest.fn(),
  };

  const mockConversationId = new Types.ObjectId();
  const mockUserId = new Types.ObjectId();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
      ],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
    conversationService = module.get<ConversationService>(ConversationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConversationById', () => {
    it('should call conversationService.get with the correct id', async () => {
      conversationService.get.mockResolvedValueOnce({
        _id: mockConversationId,
      });

      const result = await controller.getConversationById(mockConversationId);

      expect(conversationService.get).toHaveBeenCalledWith(mockConversationId);
      expect(result).toEqual({ _id: mockConversationId });
    });
  });

  describe('addMessage', () => {
    const mockReq = {
      auth: { id: mockUserId } as AccessTokenPayload,
    } as Request & { auth: AccessTokenPayload };
    const mockMessage = 'Hello, world!';

    it('should call conversationService.addMessage with correct parameters', async () => {
      conversationService.addMessage.mockResolvedValueOnce(null);

      await controller.addMessage(mockConversationId, mockReq, mockMessage);

      expect(conversationService.addMessage).toHaveBeenCalledWith(
        mockConversationId,
        mockUserId,
        mockMessage,
      );
    });
  });
});
