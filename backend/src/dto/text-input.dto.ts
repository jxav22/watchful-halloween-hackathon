import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class TextInputDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  paragraph: string;

  @IsNumber()
  @Min(3)
  @Max(12)
  age: number;
}

