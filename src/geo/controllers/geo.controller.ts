import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { GeoService } from '../services/geo.service';
import { query } from 'express';

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

    return this.geoService.search(postalCode);
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
      return await this.geoService.getDistance(
        firstPostalCode,
        secondPostalCode,
      );
    } catch (e) {
      throw new BadRequestException('Distance could not be calculated');
    }
  }
}
