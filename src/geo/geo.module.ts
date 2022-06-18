import { Module } from '@nestjs/common';
import { GeoController } from './controllers/geo.controller';
import { GeoService } from './services/geo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { ViaCepService } from './services/via-cep.service';
import { HereService } from './services/here.service';
import { RouterApiService } from './services/router-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [GeoController],
  providers: [GeoService, ViaCepService, HereService, RouterApiService],
})
export class GeoModule {}
