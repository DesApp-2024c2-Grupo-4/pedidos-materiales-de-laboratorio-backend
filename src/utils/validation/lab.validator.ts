import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Labs } from '../../request/request.const';

export function IsLabKey(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLabKey',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value in Labs;
        },
        defaultMessage(args: ValidationArguments) {
          return `$property must be one of the following keys: ${Object.keys(Labs).join(', ')}`;
        },
      },
    });
  };
}
