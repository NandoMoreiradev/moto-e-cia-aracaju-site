import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [R2Module],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
