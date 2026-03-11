import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@motoeciaaracaju.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha_segura' })
  @IsString()
  @MinLength(6)
  password: string;
}
