import { Module } from '@nestjs/common';
import { SubmittalsController } from './submittals.controller';
import { SubmittalsService } from './submittals.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [SubmittalsController],
  providers: [SubmittalsService, PrismaService],
  exports: [SubmittalsService],
})
export class SubmittalsModule {}
