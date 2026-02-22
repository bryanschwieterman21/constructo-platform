import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateSubmittalDto } from './dto/create-submittal.dto';
import { UpdateSubmittalDto } from './dto/update-submittal.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  PaginationDto,
  paginate,
  paginatedResponse,
} from '../common/dto/pagination.dto';

@Injectable()
export class SubmittalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    dto: CreateSubmittalDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const lastSubmittal = await this.prisma.submittal.findFirst({
      where: { projectId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    const nextNumber = (lastSubmittal?.number ?? 0) + 1;

    return this.prisma.submittal.create({
      data: {
        number: nextNumber,
        title: dto.title,
        description: dto.description,
        specSection: dto.specSection,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        leadTimeDays: dto.leadTimeDays,
        projectId,
        createdById: user.id,
        status: 'DRAFT',
        currentRevision: 0,
      },
    });
  }

  async findAll(
    projectId: string,
    pagination: PaginationDto,
    user: { id: string; email: string; orgId: string },
    status?: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const where: any = {
      projectId,
    };

    if (status) {
      where.status = status;
    }

    const { skip, take } = paginate(pagination);

    const [data, total] = await Promise.all([
      this.prisma.submittal.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, email: true } },
          assignee: { select: { id: true, email: true } },
        },
      }),
      this.prisma.submittal.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async findOne(
    projectId: string,
    id: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const submittal = await this.prisma.submittal.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
      include: {
        createdBy: { select: { id: true, email: true } },
        assignee: { select: { id: true, email: true } },
        revisions: {
          include: {
            createdBy: { select: { id: true, email: true } },
          },
          orderBy: { revisionNum: 'asc' },
        },
      },
    });

    if (!submittal) {
      throw new NotFoundException('Submittal not found');
    }

    return submittal;
  }

  async update(
    projectId: string,
    id: string,
    dto: UpdateSubmittalDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const submittal = await this.prisma.submittal.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
    });

    if (!submittal) {
      throw new NotFoundException('Submittal not found');
    }

    if (submittal.status === 'CLOSED') {
      throw new ForbiddenException('Cannot update a closed submittal');
    }

    return this.prisma.submittal.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        specSection: dto.specSection,
        assigneeId: dto.assigneeId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        leadTimeDays: dto.leadTimeDays,
      },
    });
  }

  async addRevision(
    projectId: string,
    id: string,
    dto: CreateRevisionDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const submittal = await this.prisma.submittal.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
    });

    if (!submittal) {
      throw new NotFoundException('Submittal not found');
    }

    if (submittal.status === 'CLOSED') {
      throw new ForbiddenException('Cannot add a revision to a closed submittal');
    }

    const nextRevisionNum = submittal.currentRevision + 1;

    const [revision] = await this.prisma.$transaction([
      this.prisma.submittalRevision.create({
        data: {
          revisionNum: nextRevisionNum,
          notes: dto.notes,
          submittalId: id,
          createdById: user.id,
        },
        include: {
          createdBy: { select: { id: true, email: true } },
        },
      }),
      this.prisma.submittal.update({
        where: { id },
        data: { currentRevision: nextRevisionNum },
      }),
    ]);

    return revision;
  }

  async changeStatus(
    projectId: string,
    id: string,
    dto: UpdateStatusDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const submittal = await this.prisma.submittal.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
    });

    if (!submittal) {
      throw new NotFoundException('Submittal not found');
    }

    if (submittal.status === 'CLOSED' && dto.status !== 'CLOSED') {
      throw new ForbiddenException('Cannot change the status of a closed submittal');
    }

    return this.prisma.submittal.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.status === 'CLOSED'
          ? { closedAt: new Date(), closedById: user.id }
          : {}),
      },
    });
  }
}
