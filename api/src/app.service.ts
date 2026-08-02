import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'cfmotorsport-api',
      timestamp: new Date().toISOString(),
    };
  }
}
