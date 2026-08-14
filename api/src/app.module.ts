import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackupModule } from './backup/backup.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'api/.env'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    JobsModule,
    BackupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
