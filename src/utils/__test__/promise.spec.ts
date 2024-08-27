import handlePromise, { handlePromiseWithId } from '../promise';

describe('UTILS > PROMISE', () => {
  describe('handlePromise', () => {
    it('should return data when promise resolves', async () => {
      const resolvedValue = 'resolved data';
      const promise = Promise.resolve(resolvedValue);

      const result = await handlePromise(promise);

      expect(result).toStrictEqual([resolvedValue]);
    });

    it('should return null and error when promise rejects', async () => {
      const errorValue = new Error('rejected error');
      const promise = Promise.reject(errorValue);

      const result = await handlePromise(promise);

      expect(result).toStrictEqual([null, errorValue]);
    });
  });

  describe('handlePromiseWithId', () => {
    it('should return id and data when promise resolves', async () => {
      const id = '123';
      const resolvedValue = 'resolved data';
      const promise = Promise.resolve(resolvedValue);

      const result = await handlePromiseWithId(id, promise);

      expect(result).toStrictEqual({ id, data: resolvedValue });
    });

    it('should return id and error when promise rejects', async () => {
      const id = '123';
      const errorValue = new Error('rejected error');
      const promise = Promise.reject(errorValue);

      const result = await handlePromiseWithId(id, promise);

      expect(result).toStrictEqual({ id, error: errorValue });
    });
  });
});
