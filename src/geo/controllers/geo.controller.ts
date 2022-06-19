import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  Query,
} from '@nestjs/common';

import { GeoService } from '../services/geo.service';

@Controller('geo')
export class GeoController {
  constructor(protected readonly geoService: GeoService) {}

  @Get('search')
  search(@Query('postalCode') postalCode: string) {
    if (!postalCode) {
      throw new HttpException('postalCode is required', 400);
    }

    postalCode = postalCode.replace(/\D/g, '');

    if (postalCode.length !== 8) {
      throw new HttpException('postalCode must have 8 numbers', 400);
    }

    try {
      return this.geoService.search(postalCode);
    } catch (e) {
      throw new HttpException('address not found', 422);
    }
  }
  @Get('get-distance-by-postalcodes')
  async getDistanceByPostalCodes(
    @Query('firstPostalCode') firstPostalCode: string,
    @Query('secondPostalCode') secondPostalCode: string,
  ) {
    if (!firstPostalCode) {
      throw new HttpException('firstPostalCode is required', 400);
    }

    if (!secondPostalCode) {
      throw new HttpException('secondPostalCode is required', 400);
    }

    firstPostalCode = firstPostalCode.replace(/\D/g, '');
    secondPostalCode = secondPostalCode.replace(/\D/g, '');

    if (firstPostalCode.length !== 8 || secondPostalCode.length !== 8) {
      throw new HttpException('postalCode must have 8 numbers', 400);
    }

    try {
      return await this.geoService.getDistanceByPostalCodes(
        firstPostalCode,
        secondPostalCode,
      );
    } catch (e) {
      throw new BadRequestException('Distance could not be calculated');
    }
  }
  @Get('get-distance-by-coordinates')
  async getDistanceByCoordinates(
    @Query('latitude1') latitude1: number,
    @Query('longitude1') longitude1: number,
    @Query('latitude2') latitude2: number,
    @Query('longitude2') longitude2: number,
  ) {
    if (!latitude1) {
      throw new HttpException('latitude1 is required', 400);
    }

    if (!latitude2) {
      throw new HttpException('latitude2 is required', 400);
    }

    if (!longitude1) {
      throw new HttpException('longitude1 is required', 400);
    }

    if (!longitude2) {
      throw new HttpException('longitude2 is required', 400);
    }

    return this.geoService.getDistanceRoute(
      longitude1,
      latitude1,
      longitude2,
      latitude2,
    );
  }
}
