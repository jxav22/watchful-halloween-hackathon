import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  generate_images?: boolean;
}

