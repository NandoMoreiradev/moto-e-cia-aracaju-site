import { Module } from '@nestjs/common';
import { LojasService } from './lojas.service';
import { LojasController } from './lojas.controller';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [R2Module],
  providers: [LojasService],
  controllers: [LojasController],
  exports: [LojasService],
})
export class LojasModule {}
