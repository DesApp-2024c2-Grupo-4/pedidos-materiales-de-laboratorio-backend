import { IsLabKey } from '../lab.validator';
import { validate } from 'class-validator';
import { Labs } from '../../../request/request.const';

class TestClass {
  @IsLabKey({ message: 'Invalid lab key!' })
  lab?: string;
}

class TestEmptyMessageClass {
  @IsLabKey()
  lab?: string;
}

describe('IsLabKey Decorator', () => {
  it('should validate valid lab keys', async () => {
    const testInstance = new TestClass();
    testInstance.lab = Object.keys(Labs)[0];

    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid lab keys', async () => {
    const testInstance = new TestClass();
    testInstance.lab = 'INVALID_KEY';

    const errors = await validate(testInstance);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isLabKey).toBe('Invalid lab key!');
  });

  it('should return the correct default message', async () => {
    const testInstance = new TestEmptyMessageClass();
    testInstance.lab = 'INVALID_KEY';

    const errors = await validate(testInstance);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isLabKey).toBe(
      'lab must be one of the following keys: ' + Object.keys(Labs).join(', '),
    );
  });
});
