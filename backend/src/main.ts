import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'verbose', 'debug'],
    abortOnError: false,
  });

  const configService = app.get(ConfigService);
  console.log(configService)

  await app.listen(3000);
}
bootstrap();
