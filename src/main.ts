import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Uygulama giriş noktası. Nest uygulamasını oluşturur ve belirtilen portta dinlemeye başlar.
 * PORT yoksa varsayılan 3000 kullanılır.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 1231);
  console.log(`Server is running on port ${process.env.PORT ?? 1231}`);
}
bootstrap();
