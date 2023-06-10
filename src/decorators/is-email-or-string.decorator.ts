import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function IsEmailOrString(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEmailOrString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const re = /^\S+@\S+\.\S+$/; // Email regex
          if (re.test(value)) {
            return args.constraints.some(
              (constraint) => constraint === 'email',
            );
          } else {
            // If it's not an email, validate that it's a string
            return typeof value === 'string';
          }
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid email or username';
        },
      },
    });
  };
}
