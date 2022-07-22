import { Test, TestingModule } from '@nestjs/testing';
import { GeoController } from './geo.controller';
import {GeoService} from "../services/geo.service";
import {HereService} from "../services/here.service";
import {RouterApiService} from "../services/router-api.service";
import {ViaCepService} from "../services/via-cep.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Address} from "../entities/address.entity";
import {Distance} from "../entities/distance.entity";

describe('GeoController', () => {
  let controller: GeoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoController],
      providers: [
        GeoService,
        HereService,
        RouterApiService,
        ViaCepService,
        {
          provide: getRepositoryToken(Address),
          useValue: {}
        },
        {
          provide: getRepositoryToken(Distance),
          useValue: {}
        },
      ]
    }).compile();

    controller = module.get<GeoController>(GeoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
