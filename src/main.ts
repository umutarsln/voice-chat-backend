import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Uygulama giriş noktası. Nest uygulamasını oluşturur ve belirtilen portta dinlemeye başlar.
 * PORT yoksa varsayılan 1231 kullanılır.
 * API dokümantasyonu: http://localhost:<PORT>/api
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 1231;

  const config = new DocumentBuilder()
    .setTitle('Voice Backend API')
    .setDescription('Voice Chat backend API dokümantasyonu')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api`);
}
bootstrap();
