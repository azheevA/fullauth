/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RegisterDto } from '../../../auth/auth.dto';

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
  public validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as RegisterDto;
    return obj.password === passwordRepeat;
  }
  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Пароли не совпадают';
  }
}
