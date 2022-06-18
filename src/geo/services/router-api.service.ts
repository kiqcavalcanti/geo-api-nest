import { Injectable } from '@nestjs/common';
import axios from 'axios';

type Routes = {
  distance: number;
};

type RequestData = {
  routes: Routes[];
};

@Injectable()
export class RouterApiService {
  protected url = 'http://router.project-osrm.org/route/v1/driving/';

  async getDistance(
    longitude1: number,
    latitude1: number,
    longitude2: number,
    latitude2: number,
  ) {
    try {
      const { data, status } = await axios.get<RequestData>(
        this.url +
          `${longitude1},${latitude1};${longitude2},${latitude2}?overview=false`,
      );

      if (status < 200 && status > 299) {
        throw new Error('Distance could not be calculated');
      }

      if (!data) {
        throw new Error('Distance could not be calculated');
      }

      if (!data.routes[0]?.distance) {
        throw new Error('Distance could not be calculated');
      }

      return data.routes[0].distance / 1000;
    } catch ($e) {
      throw new Error('Distance could not be calculated');
    }
  }
}
