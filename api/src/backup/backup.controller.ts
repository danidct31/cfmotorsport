import {
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backup: BackupService) {}

  @Get()
  snapshot() {
    return this.backup.snapshot();
  }

  @Post('send')
  send(@Headers('x-backup-secret') secret?: string) {
    const expected = process.env.BACKUP_SECRET?.trim();
    if (!expected || secret !== expected) {
      throw new UnauthorizedException('Invalid backup secret');
    }
    return this.backup.sendBackup();
  }
}
