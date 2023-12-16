import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  HomeCreateRequestDTO,
  HomeUpdateDTO,
  HomesResponseDTO,
  InquireDTO,
} from './dto/home.dto';
import { ProptertyType, UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';
import { userType } from 'src/types/userTypes';
import { Roles } from 'src/decorators/role.decorator';

@Controller('homes')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getAllHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') type_property?: ProptertyType,
  ): Promise<HomesResponseDTO[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(type_property &&
        (type_property === ProptertyType.RESIDENTIAL ||
          type_property === ProptertyType.CONDO) && { type_property }),
    };
    return this.homeService.getAllHomes(filters);
  }
  @Get('/:id')
  getHomeByID(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HomesResponseDTO> {
    return this.homeService.getHomeById(id);
  }
  @Roles(UserType.REALTOR)
  @Post()
  createHome(
    @Body() createHomeData: HomeCreateRequestDTO,
    @User() user: userType,
  ) {
    return this.homeService.createHome(createHomeData, user.id);
  }
  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: userType,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(homeId);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.getHomeMessagesById(homeId);
  }
  @Roles(UserType.REALTOR)
  @Put('/:id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeData: HomeUpdateDTO,
    @User() user: userType,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(user.id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.updateHomeById(id, updateHomeData);
  }
  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Delete('/:id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: userType,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }
  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  inquireAboutHouse(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: userType,
    @Body() messageData: InquireDTO,
  ) {
    return this.homeService.inquireAboutHome(homeId, user, messageData);
  }
}
