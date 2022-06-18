import { Test, TestingModule } from '@nestjs/testing';
import { ViaCepService } from './via-cep.service';

describe('ViaCepService', () => {
  let service: ViaCepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViaCepService],
    }).compile();

    service = module.get<ViaCepService>(ViaCepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
