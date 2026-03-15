import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MotosModule } from './motos/motos.module';
import { BlogModule } from './blog/blog.module';
import { LeadsModule } from './leads/leads.module';
import { R2Module } from './r2/r2.module';
import { MetaModule } from './meta/meta.module';
import { BannersModule } from './banners/banners.module';
import { MarcasModule } from './marcas/marcas.module';

@Module({
  imports: [
    // Config global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    // Módulos da aplicação
    PrismaModule,
    AuthModule,
    MotosModule,
    BlogModule,
    LeadsModule,
    R2Module,
    MetaModule,
    BannersModule,
    MarcasModule,
  ],
})
export class AppModule {}
