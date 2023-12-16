import { ProptertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';

class ImageDTO {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class HomeCreateRequestDTO {
  @IsString()
  @IsNotEmpty()
  addres: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsNumber()
  @IsPositive()
  landSize: number;
  @IsEnum(ProptertyType)
  typeProperty: ProptertyType;
  @IsString()
  @IsNotEmpty()
  currency: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDTO)
  images: ImageDTO[];
}

export class HomeUpdateDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  addres?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;
  @IsOptional()
  @IsEnum(ProptertyType)
  typeProperty?: ProptertyType;
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  currency?: string;
}

export class HomesResponseDTO {
  id: number;
  addres: string;
  price: number;
  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bathrooms;
  }
  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  image: string;
  city: string;
  @Exclude()
  listed_date: Date;
  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }
  @Exclude()
  type_property: ProptertyType;
  @Expose({ name: 'typeProperty' })
  typeProperty() {
    return this.type_property;
  }
  currency: string;
  @Exclude()
  created_at: Date;
  @Exclude()
  update_at: Date;
  @Exclude()
  realtor_id: number;
  constructor(partiall: Partial<HomesResponseDTO>) {
    Object.assign(this, partiall);
  }
}

export class InquireDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}
