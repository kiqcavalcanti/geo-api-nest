import { Test, TestingModule } from '@nestjs/testing';
import { GeoService } from './geo.service';
import {HereService} from "./here.service";
import {RouterApiService} from "./router-api.service";
import {ViaCepService} from "./via-cep.service";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {Address} from "../entities/address.entity";
import {Distance} from "../entities/distance.entity";
import MockedFunction = jest.MockedFunction;
import {NotFoundException} from "@nestjs/common";

type MockRepositoryType = {
  findOneBy: MockedFunction<any>
}

const mockRepository: MockRepositoryType = {
  findOneBy: jest.fn()
};

type MockViaApiServiceType = {
  findByPostalCode: MockedFunction<any>
}

const mockViaApiService: MockViaApiServiceType = {
  findByPostalCode: jest.fn()
};

describe('GeoService', () => {
  let service: GeoService;
  let hereService: HereService;
  let routerApiService: RouterApiService;
  let viaCepService: MockViaApiServiceType;
  let addressRepository:  MockRepositoryType
  let distanceRepository: MockRepositoryType

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoService,
        HereService,
        RouterApiService,
        // ViaCepService,
        {
          provide: ViaCepService,
          useValue: mockViaApiService
        },
        {
          provide: getRepositoryToken(Address),
          useValue: mockRepository
        },
        {
          provide: getRepositoryToken(Distance),
          useValue: mockRepository
        },

      ]
    }).compile();

    hereService = await module.get<HereService>(HereService);
    routerApiService = await module.get<RouterApiService>(RouterApiService);
    viaCepService = mockViaApiService;
    service = await module.get<GeoService>(GeoService)
    addressRepository = mockRepository
    distanceRepository = mockRepository
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should return address', async () => {

      const expectedValue =  {
        city: 'São Paulo',
        street: 'rua x',
        state: 'SP',
        postalCode: '05850-190',
        latitude: -0,
        longitude: -0,
        neighborhood: 'bairro'
      }

      addressRepository.findOneBy.mockReturnValue(expectedValue)

      const search = await service.search('05850190');

      expect(search).toEqual(expectedValue);
    });

    it('should return notFound', async () => {


      addressRepository.findOneBy.mockReturnValue(null);

      viaCepService.findByPostalCode.mockImplementation(() =>  {
        throw new NotFoundException('Address not found')
      });

      try {
        await service.search('00000000');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

    });
  })


});
