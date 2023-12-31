import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO, SignInDTO, GenerateProductKeyDTO } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User } from '../decorators/user.decorator';
import { userType } from 'src/types/userTypes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/me')
  async getMe(@User() user: userType) {
    return this.authService.getMe(user.id);
  }
  @Post('/signup/:userType')
  async signup(
    @Body() userRegisterData: SignUpDTO,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!userRegisterData.productKey) {
        throw new UnauthorizedException();
      }
      const validProductKey = `${userRegisterData.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        userRegisterData.productKey,
      );
      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(userRegisterData, userType);
  }
  @Post('/sighin')
  async signin(@Body() userSignInData: SignInDTO) {
    return this.authService.signIn(userSignInData);
  }
  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDTO) {
    return this.authService.generateProductKey(email, userType);
  }
}
