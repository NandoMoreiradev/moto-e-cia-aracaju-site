import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsString() @IsNotEmpty() nome: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsString() @IsNotEmpty() mensagem: string;
  @IsOptional() @IsString() motoInteresse?: string;
}
