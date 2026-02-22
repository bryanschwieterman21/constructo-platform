import { Module } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service';
import { DailyLogsController } from './daily-logs.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [DailyLogsController],
  providers: [DailyLogsService, PrismaService],
  exports: [DailyLogsService],
})
export class DailyLogsModule {}
