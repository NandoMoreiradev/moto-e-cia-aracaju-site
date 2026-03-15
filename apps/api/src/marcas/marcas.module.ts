import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [R2Module],
  providers: [MarcasService],
  controllers: [MarcasController],
  exports: [MarcasService],
})
export class MarcasModule {}
