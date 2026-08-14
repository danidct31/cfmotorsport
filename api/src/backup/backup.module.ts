import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

@Module({
  imports: [JobsModule],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}
