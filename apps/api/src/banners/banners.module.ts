import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [R2Module],
  providers: [BannersService],
  controllers: [BannersController],
  exports: [BannersService],
})
export class BannersModule {}
