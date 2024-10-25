import { validate } from 'class-validator';
import { IsObjectId } from '../id-validator';
import { Types } from 'mongoose';

// Sample class to test the IsObjectId decorator
class TestClass {
  @IsObjectId({ message: 'Invalid ObjectId' })
  id: string;
}

describe('IsObjectId Decorator', () => {
  it('should validate a valid ObjectId', async () => {
    const validId = new Types.ObjectId().toString();
    const testInstance = new TestClass();
    testInstance.id = validId;

    const errors = await validate(testInstance);
    expect(errors).toHaveLength(0); // No validation errors should be present
  });

  it('should invalidate an invalid ObjectId', async () => {
    const invalidId = 'invalidObjectId';
    const testInstance = new TestClass();
    testInstance.id = invalidId;

    const errors = await validate(testInstance);
    expect(errors).toHaveLength(1); // There should be one validation error
    expect(errors[0].constraints).toHaveProperty(
      'IsObjectId',
      'Invalid ObjectId',
    );
  });

  it('should invalidate an empty value', async () => {
    const testInstance = new TestClass();
    testInstance.id = ''; // Empty string

    const errors = await validate(testInstance);
    expect(errors).toHaveLength(1); // There should be one validation error
    expect(errors[0].constraints).toHaveProperty(
      'IsObjectId',
      'Invalid ObjectId',
    );
  });

  it('should invalidate a non-ObjectId value', async () => {
    const testInstance = new TestClass();
    testInstance.id = '12345'; // Non-ObjectId string

    const errors = await validate(testInstance);
    expect(errors).toHaveLength(1); // There should be one validation error
    expect(errors[0].constraints).toHaveProperty(
      'IsObjectId',
      'Invalid ObjectId',
    );
  });
});
