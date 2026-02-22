import { Module } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { DirectoryController } from './directory.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [DirectoryController],
  providers: [DirectoryService, PrismaService],
  exports: [DirectoryService],
})
export class DirectoryModule {}
