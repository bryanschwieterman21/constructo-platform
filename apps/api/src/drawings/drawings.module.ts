import { Module } from '@nestjs/common';
import { DrawingsService } from './drawings.service';
import { DrawingsController } from './drawings.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [DrawingsController],
  providers: [DrawingsService, PrismaService],
  exports: [DrawingsService],
})
export class DrawingsModule {}
