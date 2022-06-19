import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { ViaCepService } from './via-cep.service';
import { HereService } from './here.service';
import { RouterApiService } from './router-api.service';
import { Distance } from '../entities/distance.entity';

@Injectable()
export class GeoService {
  constructor(
    protected readonly viaApiService: ViaCepService,
    protected readonly hereService: HereService,
    protected readonly routeApiService: RouterApiService,
    @InjectRepository(Address)
    protected readonly addressRepository: Repository<Address>,
    @InjectRepository(Distance)
    protected readonly distanceRepository: Repository<Distance>,
  ) {}

  async search(postalCode: string) {
    let address = await this.addressRepository.findOneBy({
      postalCode: postalCode,
    });

    if (address) {
      return { ...address, id: undefined };
    }

    const promises = await Promise.all([
      this.viaApiService.findByPostalCode(postalCode),
      this.hereService.findByPostalCode(postalCode),
    ]);

    const [addressData, { latitude, longitude }] = promises;

    address = await this.addressRepository.create({
      ...addressData,
      latitude: latitude ?? 0.0,
      longitude: longitude ?? 0.0,
      postalCode: postalCode,
    });

    address = await this.addressRepository.save(address);

    return { ...address, id: undefined };
  }

  async getDistanceByPostalCodes(
    firstPostalCode: string,
    secondPostalCode: string,
  ) {
    const findAddresses = await Promise.all([
      this.addressRepository.findOneBy({
        postalCode: firstPostalCode,
      }),
      this.addressRepository.findOneBy({
        postalCode: secondPostalCode,
      }),
    ]);

    let [firstAddress, secondAddress] = findAddresses;

    const searchAdresses = [];

    if (!firstAddress) {
      searchAdresses.push(this.search(firstPostalCode));
    }

    if (!secondAddress) {
      searchAdresses.push(this.search(secondPostalCode));
    }

    if (searchAdresses.length > 0) {
      const data = await Promise.all(searchAdresses);

      secondAddress =
        !secondAddress && !firstAddress
          ? data[1]
          : !secondAddress && firstAddress
          ? data[0]
          : secondAddress;

      firstAddress = !firstAddress ? data[0] : firstAddress;
    }

    if (!firstAddress) {
      throw new Error(`${firstPostalCode} postalCode not found any address`);
    }

    if (!secondAddress) {
      throw new Error(`${secondPostalCode} postalCode not found any address`);
    }

    return await this.getDistanceRoute(
      firstAddress.longitude,
      firstAddress.latitude,
      secondAddress.longitude,
      secondAddress.latitude,
    );
  }

  async getDistanceRoute(
    longitude1: number,
    latitude1: number,
    longitude2: number,
    latitude2: number,
  ) {
    const hash = Buffer.from(
      longitude1 + ',' + latitude1 + ',' + longitude2 + ',' + latitude2,
    ).toString('base64');

    const distanceData = await this.distanceRepository.findOneBy({
      coordinatesHash: hash,
    });

    if (distanceData) {
      return {
        distance: distanceData.distance,
      };
    }

    const distanceInKm = await this.routeApiService.getDistance(
      longitude1,
      latitude1,
      longitude2,
      latitude2,
    );

    const distance = this.distanceRepository.create({
      coordinatesHash: hash,
      distance: distanceInKm,
    });

    await this.distanceRepository.save(distance);

    return {
      distance: distanceInKm,
    };
  }
}
