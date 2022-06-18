import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeoModule } from './geo/geo.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GeoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres_geo-api-nest',
      port: 5432,
      username: 'geo-api-admin',
      password: '1234',
      database: 'geo-api',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
