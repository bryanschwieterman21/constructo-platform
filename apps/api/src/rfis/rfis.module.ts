import { Module } from '@nestjs/common';
import { RfisController } from './rfis.controller';
import { RfisService } from './rfis.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [RfisController],
  providers: [RfisService, PrismaService],
  exports: [RfisService],
})
export class RfisModule {}
