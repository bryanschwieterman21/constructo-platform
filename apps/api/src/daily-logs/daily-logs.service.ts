import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import {
  PaginationDto,
  paginate,
  paginatedResponse,
} from '../common/dto/pagination.dto';

@Injectable()
export class DailyLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    dto: CreateDailyLogDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const existing = await this.prisma.dailyLog.findFirst({
      where: {
        projectId,
        date: new Date(dto.date),
        project: { orgId: user.orgId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'A daily log already exists for this project on this date',
      );
    }

    return this.prisma.dailyLog.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        projectId,
        createdById: user.id,
      },
    });
  }

  async findAll(
    projectId: string,
    pagination: PaginationDto,
    user: { id: string; email: string; orgId: string },
    filters?: { startDate?: string; endDate?: string },
  ) {
    const where: any = {
      projectId,
      project: { orgId: user.orgId },
    };

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    const { skip, take } = paginate(pagination);

    const [data, total] = await Promise.all([
      this.prisma.dailyLog.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
      }),
      this.prisma.dailyLog.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async findOne(
    projectId: string,
    id: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const dailyLog = await this.prisma.dailyLog.findFirst({
      where: {
        id,
        projectId,
        project: { orgId: user.orgId },
      },
      include: {
        manpowerLogs: true,
      },
    });

    if (!dailyLog) {
      throw new NotFoundException('Daily log not found');
    }

    return dailyLog;
  }

  async update(
    projectId: string,
    id: string,
    dto: UpdateDailyLogDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOne(projectId, id, user);

    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }

    return this.prisma.dailyLog.update({
      where: { id },
      data,
    });
  }

  async addManpower(
    projectId: string,
    dailyLogId: string,
    dto: CreateManpowerDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOne(projectId, dailyLogId, user);

    return this.prisma.manpowerLog.create({
      data: {
        ...dto,
        dailyLogId,
      },
    });
  }

  async updateManpower(
    projectId: string,
    dailyLogId: string,
    manpowerId: string,
    dto: Partial<CreateManpowerDto>,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOne(projectId, dailyLogId, user);

    const manpowerLog = await this.prisma.manpowerLog.findFirst({
      where: {
        id: manpowerId,
        dailyLogId,
      },
    });

    if (!manpowerLog) {
      throw new NotFoundException('Manpower log not found');
    }

    return this.prisma.manpowerLog.update({
      where: { id: manpowerId },
      data: dto,
    });
  }
}
