import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Имя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя не может быть пустым.' })
  name!: string;

  @IsString({ message: 'Email должен быть строкой.' })
  @IsEmail({}, { message: 'Некорректный формат email.' })
  @IsNotEmpty({ message: 'Email не может быть пустым.' })
  email!: string;

  @IsBoolean({ message: 'isTwoFactorEnabled должно быть булевым значением.' })
  isTwoFactorEnabled!: boolean;
}
