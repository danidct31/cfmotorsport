import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller()
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get('jobs/:kind')
  list(@Param('kind') kind: string) {
    return this.jobs.list(kind);
  }

  @Post('jobs/:kind')
  create(@Param('kind') kind: string, @Body() body: { text?: string }) {
    return this.jobs.create(kind, body.text);
  }

  @Patch('jobs/item/:id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      text?: string;
      checked?: boolean;
      dueDate?: string | null;
      priority?: number;
    },
  ) {
    return this.jobs.update(id, body);
  }

  @Delete('jobs/item/:id')
  remove(@Param('id') id: string) {
    return this.jobs.remove(id);
  }

  @Get('notes/:parentId')
  listNotes(@Param('parentId') parentId: string) {
    return this.jobs.listNotes(parentId);
  }

  @Post('notes/:parentId')
  createNote(
    @Param('parentId') parentId: string,
    @Body() body: { text?: string },
  ) {
    return this.jobs.createNote(parentId, body.text);
  }

  @Patch('notes/item/:id')
  updateNote(
    @Param('id') id: string,
    @Body() body: { text?: string; checked?: boolean },
  ) {
    return this.jobs.updateNote(id, body);
  }

  @Delete('notes/item/:id')
  removeNote(@Param('id') id: string) {
    return this.jobs.removeNote(id);
  }
}
