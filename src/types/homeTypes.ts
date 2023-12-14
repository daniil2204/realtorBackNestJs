import { ProptertyType } from '@prisma/client';

export interface GetHomesParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  type_property: ProptertyType;
}

type ImageType = {
  url: string;
};

export interface CreateHomeParams {
  addres: string;
  price: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  landSize: number;
  typeProperty: ProptertyType;
  currency: string;
  images: ImageType[];
}

export interface UpdateHomeParams {
  addres?: string;
  price?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  landSize?: number;
  typeProperty?: ProptertyType;
  currency?: string;
}
