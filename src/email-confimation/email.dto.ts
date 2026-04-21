import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
  @IsString({ message: 'Токен должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле токен не моежт быть пустым' })
  token!: string;
}
