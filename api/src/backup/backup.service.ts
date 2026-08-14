import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import nodemailer from 'nodemailer';
import { JobsService } from '../jobs/jobs.service';

const DEFAULT_TO = 'danidct17@gmail.com';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(private readonly jobs: JobsService) {}

  @Cron('0 8 1 * *')
  async monthly() {
    this.logger.log('Starting monthly database backup email');
    await this.sendBackup();
  }

  async sendBackup() {
    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();
    const to = (process.env.BACKUP_EMAIL ?? DEFAULT_TO).trim();

    if (!host || !user || !pass) {
      this.logger.warn(
        'Backup email skipped — set SMTP_HOST, SMTP_USER, and SMTP_PASS on the API service.',
      );
      return { ok: false as const, reason: 'smtp-not-configured' };
    }

    const snapshot = await this.jobs.exportAll();
    const day = snapshot.exportedAt.slice(0, 10);
    const filename = `cfmotorsport-backup-${day}.json`;
    const port = Number(process.env.SMTP_PORT) || 587;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || user,
      to,
      subject: `CF Motorsport backup ${day}`,
      text: [
        'Monthly backup of CF Motorsport jobs.',
        '',
        `Jobs: ${snapshot.jobs.length}`,
        `Notes: ${snapshot.notes.length}`,
        `Source: ${snapshot.source}`,
        `Exported: ${snapshot.exportedAt}`,
        '',
        'Keep the attached JSON file. It can be used to restore jobs later.',
      ].join('\n'),
      attachments: [
        {
          filename,
          content: JSON.stringify(snapshot, null, 2),
          contentType: 'application/json',
        },
      ],
    });

    this.logger.log(`Backup emailed to ${to} (${filename})`);
    return {
      ok: true as const,
      to,
      filename,
      jobs: snapshot.jobs.length,
      notes: snapshot.notes.length,
    };
  }
}
