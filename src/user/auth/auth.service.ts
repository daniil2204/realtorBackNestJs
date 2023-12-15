import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { userRegisterType, userSignInType } from 'src/types/userTypes';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async getMe(id: number) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
  async signup(
    { email, password, name, phone }: userRegisterType,
    userType: UserType,
  ) {
    const userExists = await this.findUserByEmail(email);
    if (userExists) {
      throw new ConflictException();
    }
    const userSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, userSalt);
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        salt: userSalt,
        phone,
        type: userType,
      },
    });
    return this.generateJWT(user.name, user.id);
  }
  async signIn({ email, password }: userSignInType) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('Invalid password or email', 400);
    }
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) {
      throw new HttpException('Invalid password or email', 400);
    }
    return this.generateJWT(user.name, user.id);
  }
  private async generateJWT(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 360000,
      },
    );
  }
  private async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async generateProductKey(email: string, userType: string) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
