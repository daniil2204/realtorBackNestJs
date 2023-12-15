import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomesResponseDTO } from './dto/home.dto';
import {
  CreateHomeParams,
  GetHomesParam,
  UpdateHomeParams,
} from 'src/types/homeTypes';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllHomes(filter: GetHomesParam): Promise<HomesResponseDTO[]> {
    const homes = await this.prismaService.home.findMany({
      where: filter,
      select: {
        id: true,
        addres: true,
        city: true,
        price: true,
        type_property: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });
    if (!homes.length) {
      throw new NotFoundException();
    }
    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new HomesResponseDTO(fetchHome);
    });
  }
  async getHomeById(id: number): Promise<HomesResponseDTO> {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: +id,
      },
    });
    if (!home) {
      throw new NotFoundException();
    }
    return new HomesResponseDTO(home);
  }
  async createHome(createHomeData: CreateHomeParams, userId: number) {
    const {
      addres,
      city,
      currency,
      images,
      landSize,
      numberOfBathrooms,
      numberOfBedrooms,
      price,
      typeProperty,
    } = createHomeData;
    const home = await this.prismaService.home.create({
      data: {
        addres,
        city,
        currency,
        land_size: landSize,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        price,
        type_property: typeProperty,
        realtor_id: userId,
      },
    });
    const homeImages = images.map((image) => {
      return {
        ...image,
        home_id: home.id,
      };
    });
    await this.prismaService.image.createMany({
      data: homeImages,
    });
    return new HomesResponseDTO(home);
  }
  async updateHomeById(id: number, updateHomeData: UpdateHomeParams) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });
    if (!home) {
      throw new NotFoundException();
    }

    const updatedHome = await this.prismaService.home.update({
      where: {
        id,
      },
      data: updateHomeData,
    });
    return new HomesResponseDTO(updatedHome);
  }
  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({
      where: {
        home_id: id,
      },
    });
    await this.prismaService.home.delete({
      where: {
        id,
      },
    });
  }
  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
            type: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException();
    }
    return home.realtor;
  }
}
