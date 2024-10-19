export default function handlePromise<T, E>(
  promise: Promise<T>,
): Promise<[T] | [null, E]> {
  return promise.then((data: T): [T] => [data]).catch((err: E) => [null, err]);
}

export function handlePromiseWithId(id, promise: Promise<any>) {
  return promise
    .then((data) => ({ id, data }))
    .catch((error) => ({ id, error }));
}
