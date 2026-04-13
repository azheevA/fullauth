import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  Validate,
  IsOptional,
} from 'class-validator';
import { IsPasswordMatchingConstraint } from '../libs/common/decorators/is-password-matching-constraint';

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  name!: string;

  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email!: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password!: string;

  @IsString({ message: 'Повтор пароля должен быть строкой' })
  @IsNotEmpty({ message: 'Подтверждение пароля обязательно' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @Validate(IsPasswordMatchingConstraint, {
    message: 'Пароли не совпадают',
  })
  passwordRepeat!: string;
}

export class LoginDto {
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email!: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password!: string;

  @IsOptional()
  @IsString({ message: 'Код должен быть строкой' })
  code?: string;
}
