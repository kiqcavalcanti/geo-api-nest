import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NotFoundError } from 'rxjs';

type AddressData = {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

type AddressRequestData = {
  uf: string;
  localidade: string;
  bairro: string;
  logradouro: string;
};

@Injectable()
export class ViaCepService {
  protected url = 'https://viacep.com.br/ws/';

  async findByPostalCode(postalCode: string) {
    const { data, status } = await axios.get<AddressRequestData>(
      this.url + postalCode + '/json',
    );

    if (!data) {
      throw new NotFoundError('Address not found');
    }

    if (status < 200 && status > 299) {
      throw new NotFoundError('Address not found');
    }

    const addressData: AddressData = {
      state: data.uf ?? '',
      city: data.localidade ?? '',
      neighborhood: data.bairro ?? '',
      street: data.logradouro ?? '',
    };

    return addressData;
  }
}
