import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

type Address = {
  address: {
    state: string;
    city: string;
    district: string;
    postalCode: string;
  };
  position: Position;
};

type Position = {
  lat: number;
  lng: number;
};

type RequestData = {
  items: Address[];
};

type HereData = {
  state: string;
  city: string;
  district: string;
  postalCode: string;
  latitude: number;
  longitude: number;
};

@Injectable()
export class HereService {
  protected url = 'https://geocode.search.hereapi.com/v1/geocode';
  protected apiKey = 'qh8Xt1JKjl6lBPG0P3OYf88wAQRGvTRv41h5g8B1TqQ';

  async findByPostalCode(postalCode: string) {
    try {
      const { data, status } = await axios.get<RequestData>(
        this.url +
          `?qq=postalCode=${postalCode};country=Bra&apiKey=${this.apiKey}&limit=1`,
      );

      if (status < 200 && status > 299) {
        throw new Error('Address not found');
      }

      if (!data) {
        throw new Error('Address not found');
      }

      const hereData: HereData = {
        state: data.items[0].address?.state ?? '',
        city: data.items[0].address?.city ?? '',
        district: data.items[0].address?.district ?? '',
        postalCode: data.items[0].address?.postalCode ?? '',
        latitude: data.items[0].position.lat ?? null,
        longitude: data.items[0].position.lng ?? null,
      };

      return hereData;
    } catch ($e) {
      throw new HttpException('Address not found', 400);
    }
  }
}
