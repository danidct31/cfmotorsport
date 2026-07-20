import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 4000;
  // Railway (and most hosts) need 0.0.0.0, not localhost
  await app.listen(port, '0.0.0.0');
  console.log(`Lisa API running on 0.0.0.0:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Lisa API', error);
  process.exit(1);
});
