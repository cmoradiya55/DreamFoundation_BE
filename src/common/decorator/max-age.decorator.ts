import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MaxAge(maxYears: number, message?: string) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'MaxAge',
      target: object.constructor,
      propertyName,
      constraints: [maxYears],
      options: {
        message:
          message ||
          `Date cannot be more than ${maxYears} years from today.`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false;

          const [maxYears] = args.constraints;
          const inputDate = new Date(value);
          if (isNaN(inputDate.getTime())) return false;

          const today = new Date();
          const limitDate = new Date();
          limitDate.setFullYear(today.getFullYear() - maxYears);

          // Input date must be greater than limitDate
          return inputDate >= limitDate;
        },
      },
    });
  };
}
