import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConversationDbService } from '../conversation-db.service';
import { Model, Types } from 'mongoose';
import { Conversation } from '../../schemas/conversation.schema';
import {
  cantCreateConversation,
  cantGetConversation,
} from '../conversation.errors';

describe('ConversationDbService', () => {
  let service: ConversationDbService;
  let conversationModel: any;

  const mockConversationModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationDbService,
        {
          provide: getModelToken(Conversation.name),
          useValue: mockConversationModel,
        },
      ],
    }).compile();

    service = module.get<ConversationDbService>(ConversationDbService);
    conversationModel = module.get<Model<Conversation>>(
      getModelToken(Conversation.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should create a conversation and return its ID', async () => {
      const mockId = new Types.ObjectId();
      conversationModel.create.mockResolvedValueOnce(mockId);

      const result = await service.add();

      expect(conversationModel.create).toHaveBeenCalledWith({});
      expect(result).toEqual(mockId);
    });

    it('should throw an error if creation fails', async () => {
      const mockError = new Error('Creation error');
      conversationModel.create.mockRejectedValue(mockError);

      await expect(service.add()).rejects.toThrow(
        cantCreateConversation(mockError),
      );
    });
  });

  describe('get', () => {
    it('should retrieve a conversation by ID', async () => {
      const mockId = new Types.ObjectId();
      const mockConversation = { _id: mockId };
      conversationModel.findOne.mockResolvedValueOnce(mockConversation);

      const result = await service.get(mockId);

      expect(conversationModel.findOne).toHaveBeenCalledWith({ _id: mockId });
      expect(result).toEqual(mockConversation);
    });

    it('should throw an error if retrieval fails', async () => {
      const mockId = new Types.ObjectId();
      const mockError = new Error('Retrieval error');
      conversationModel.findOne.mockRejectedValue(mockError);

      await expect(service.get(mockId)).rejects.toThrow(
        cantGetConversation(mockId, mockError),
      );
    });
  });
});
