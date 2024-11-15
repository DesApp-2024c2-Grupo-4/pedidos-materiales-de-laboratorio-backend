import { registerDecorator, ValidationOptions } from 'class-validator';
import { Labs } from '../../request/request.const';

export function IsLabKey(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLabKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value in Labs;
        },
        defaultMessage() {
          return `$property must be one of the following keys: ${Object.keys(Labs).join(', ')}`;
        },
      },
    });
  };
}
