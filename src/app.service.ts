import { Injectable } from '@nestjs/common';

/**
 * Ana uygulama servisi. Basit iş mantığı metodları sağlar.
 */
@Injectable()
export class AppService {
  /**
   * Karşılama mesajı döner.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
