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
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  HomeCreateRequestDTO,
  HomeUpdateDTO,
  HomesResponseDTO,
} from './dto/home.dto';
import { ProptertyType } from '@prisma/client';

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
  @Post()
  createHome(@Body() createHomeData: HomeCreateRequestDTO) {
    return this.homeService.createHome(createHomeData);
  }
  @Put('/:id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeData: HomeUpdateDTO,
  ) {
    return this.homeService.updateHomeById(id, updateHomeData);
  }
  @Delete('/:id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHomeById(id);
  }
}
