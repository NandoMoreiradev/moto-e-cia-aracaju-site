import { Global, Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';

@Global()
@Module({
  providers: [MetaService],
  controllers: [MetaController],
  exports: [MetaService],
})
export class MetaModule {}
