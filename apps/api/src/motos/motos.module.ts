import { Module } from '@nestjs/common';
import { MotosService } from './motos.service';
import { MotosController } from './motos.controller';
import { R2Module } from '../r2/r2.module';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [R2Module, MetaModule],
  providers: [MotosService],
  controllers: [MotosController],
  exports: [MotosService],
})
export class MotosModule {}
