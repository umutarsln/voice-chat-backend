import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Ana API controller. Kök (/) isteklerini yönetir.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET / - Karşılama mesajı döner.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
