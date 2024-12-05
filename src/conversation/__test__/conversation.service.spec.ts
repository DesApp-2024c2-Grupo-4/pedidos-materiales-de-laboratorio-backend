import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from '../conversation.service';
import { ConversationDbService } from '../conversation-db.service';
import { UserDbService } from '../../user/user-db.service';
import { Types } from 'mongoose';
import { BackendException } from '../../shared/backend.exception';
import { HttpStatus } from '@nestjs/common';
import { cantAddMessage } from '../conversation.errors';

describe('ConversationService', () => {
  let service: ConversationService;
  let conversationDbService: any;
  let userDbService: any;

  const mockConversationDbService = {
    get: jest.fn(),
    add: jest.fn(),
  };
  const mockUserDbService = {
    get: jest.fn(),
  };
  const mockConversation = {
    _id: new Types.ObjectId(),
    addMessage: jest.fn(),
    save: jest.fn(),
    messages: [],
  };
  const mockUser = { _id: new Types.ObjectId() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        { provide: ConversationDbService, useValue: mockConversationDbService },
        { provide: UserDbService, useValue: mockUserDbService },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    conversationDbService = module.get<ConversationDbService>(
      ConversationDbService,
    );
    userDbService = module.get<UserDbService>(UserDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConversationById', () => {
    it('should return a conversation if found', async () => {
      conversationDbService.get.mockResolvedValueOnce(mockConversation);

      const result = await service.get(mockConversation._id);

      expect(conversationDbService.get).toHaveBeenCalledWith(
        mockConversation._id,
      );
      expect(result).toEqual(mockConversation);
    });

    it('should throw a 500 error if retrieval fails', async () => {
      const error = new Error('Retrieval error');
      conversationDbService.get.mockRejectedValue(error);

      await expect(service.get(mockConversation._id)).rejects.toThrow(
        new BackendException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should throw a 404 error if conversation not found', async () => {
      conversationDbService.get.mockResolvedValueOnce(null);

      await expect(service.get(mockConversation._id)).rejects.toThrow(
        new BackendException('', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('addMessage', () => {
    const content = 'Test message';

    it('should add a message to a conversation and save it', async () => {
      conversationDbService.get.mockResolvedValueOnce(mockConversation);
      userDbService.get.mockResolvedValue(mockUser);
      mockConversation.save.mockResolvedValue(null);

      await service.addMessage(mockConversation._id, mockUser._id, content);

      expect(conversationDbService.get).toHaveBeenCalledWith(
        mockConversation._id,
      );
      expect(userDbService.get).toHaveBeenCalledWith(mockUser._id);
      expect(mockConversation.addMessage).toHaveBeenCalledWith(
        mockUser._id,
        content,
      );
      expect(mockConversation.save).toHaveBeenCalled();
    });

    it('should throw a 500 error if conversation retrieval fails', async () => {
      const error = new Error('Retrieval error');
      conversationDbService.get.mockRejectedValue(error);

      await expect(
        service.addMessage(mockConversation._id, mockUser._id, content),
      ).rejects.toThrow(
        new BackendException(
          cantAddMessage(mockConversation._id, mockUser._id, error),
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw a 400 error if conversation not found', async () => {
      conversationDbService.get.mockResolvedValueOnce(null);

      await expect(
        service.addMessage(mockConversation._id, mockUser._id, content),
      ).rejects.toThrow(
        new BackendException(
          `Conversation with id ${mockConversation._id} not found`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw a 500 error if user retrieval fails', async () => {
      const error = new Error('User retrieval error');
      conversationDbService.get.mockResolvedValueOnce(mockConversation);
      userDbService.get.mockRejectedValue(error);

      await expect(
        service.addMessage(mockConversation._id, mockUser._id, content),
      ).rejects.toThrow(
        new BackendException(
          cantAddMessage(mockConversation._id, mockUser._id, error),
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw a 400 error if user not found', async () => {
      conversationDbService.get.mockResolvedValueOnce(mockConversation);
      userDbService.get.mockResolvedValueOnce(null);

      await expect(
        service.addMessage(mockConversation._id, mockUser._id, content),
      ).rejects.toThrow(
        new BackendException(
          `User with id ${mockUser._id} not found`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw a 500 error if saving message fails', async () => {
      const error = new Error('Save error');
      conversationDbService.get.mockResolvedValueOnce(mockConversation);
      userDbService.get.mockResolvedValue(mockUser);
      mockConversation.save.mockRejectedValue(error);

      await expect(
        service.addMessage(mockConversation._id, mockUser._id, content),
      ).rejects.toThrow(
        new BackendException(
          cantAddMessage(mockConversation._id, mockUser._id, error),
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
