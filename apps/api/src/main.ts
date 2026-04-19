import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { execSync } from 'child_process';
import { AppModule } from './app.module';

async function bootstrap() {
  // Aplica migrations pendentes antes de iniciar a API
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log('⏳ Aplicando migrations do banco de dados...');
      const path = require('path');
      const schemaPath = path.resolve(__dirname, '../../../prisma/schema.prisma');
      execSync(`npx prisma migrate deploy --schema=${schemaPath}`, {
        stdio: 'inherit',
      });
      console.log('✅ Migrations aplicadas com sucesso.');
    } catch (err) {
      console.error('❌ Falha ao aplicar migrations:', err);
      process.exit(1);
    }
  }

  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Prefix global da API
  app.setGlobalPrefix('api');

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger (só em desenvolvimento)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Moto e Cia Aracaju — API')
      .setDescription('API do novo site da Moto e Cia Aracaju')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🏍️  API rodando em http://0.0.0.0:${port}`);
  console.log(`📚 Swagger em http://0.0.0.0:${port}/docs`);
}

bootstrap();
