import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, '127.0.0.1');

  const url = await app.getUrl();
  console.log(`Application is running on: \x1b[36m%s\x1b[0m`, url);
}
bootstrap();
