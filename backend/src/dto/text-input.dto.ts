import { IsString, IsNotEmpty } from 'class-validator';

export class TextInputDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

