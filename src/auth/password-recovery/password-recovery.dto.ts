import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Введите корректный адрес электронной почты' })
  @IsNotEmpty({ message: 'Поле email не может быть пустым' })
  email!: string;
}

export class NewPasswordDto {
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
  @IsNotEmpty({ message: 'Поле новый пароль не может быть пустым' })
  password!: string;
}
