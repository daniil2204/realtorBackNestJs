import { UserType } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone is not valid',
  })
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SignInDTO {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}

export class GenerateProductKeyDTO {
  @IsEmail()
  email: string;
  @IsEnum(UserType)
  userType: UserType;
}
