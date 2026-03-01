import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * Ana API controller. Kök (/) isteklerini yönetir.
 */
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET / - Karşılama mesajı döner.
   */
  @Get()
  @ApiOperation({ summary: 'Karşılama mesajı' })
  getHello(): string {
    return this.appService.getHello();
  }
}
