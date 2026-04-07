import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  Validate,
} from 'class-validator';
import { IsPasswordMatchingConstraint } from '../libs/common/decorators/is-password-matching-constraint';

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнений.' })
  name!: string;

  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Имя обязательно для заполнений.' })
  @MinLength(6, { message: 'Имя обязательно для заполнений.' })
  email!: string;

  @IsString({ message: 'Имя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнений.' })
  @MinLength(6, { message: 'Имя обязательно для заполнений.' })
  password!: string;

  @IsString({ message: 'Имя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнений.' })
  @MinLength(6, { message: 'Имя обязательно для заполнений.' })
  @Validate(IsPasswordMatchingConstraint, { message: 'Пароли не совпадают' })
  passwordRepeat!: string;
}
