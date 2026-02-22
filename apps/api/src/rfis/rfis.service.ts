import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateRfiDto } from './dto/create-rfi.dto';
import { UpdateRfiDto } from './dto/update-rfi.dto';
import { RespondRfiDto } from './dto/respond-rfi.dto';
import {
  PaginationDto,
  paginate,
  paginatedResponse,
} from '../common/dto/pagination.dto';

@Injectable()
export class RfisService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    dto: CreateRfiDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, orgId: user.orgId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const lastRfi = await this.prisma.rfi.findFirst({
      where: { projectId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    const nextNumber = (lastRfi?.number ?? 0) + 1;

    return this.prisma.rfi.create({
      data: {
        number: nextNumber,
        subject: dto.subject,
        question: dto.question,
        assigneeId: dto.assigneeId,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        costImpact: dto.costImpact,
        scheduleImpact: dto.scheduleImpact,
        projectId,
        createdById: user.id,
        status: 'OPEN',
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
      this.prisma.rfi.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, email: true } },
          assignee: { select: { id: true, email: true } },
        },
      }),
      this.prisma.rfi.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async findOne(
    projectId: string,
    id: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const rfi = await this.prisma.rfi.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
      include: {
        createdBy: { select: { id: true, email: true } },
        assignee: { select: { id: true, email: true } },
        responses: {
          include: {
            responder: { select: { id: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        attachments: true,
      },
    });

    if (!rfi) {
      throw new NotFoundException('RFI not found');
    }

    return rfi;
  }

  async update(
    projectId: string,
    id: string,
    dto: UpdateRfiDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const rfi = await this.prisma.rfi.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
    });

    if (!rfi) {
      throw new NotFoundException('RFI not found');
    }

    if (rfi.status === 'CLOSED') {
      throw new ForbiddenException('Cannot update a closed RFI');
    }

    return this.prisma.rfi.update({
      where: { id },
      data: {
        subject: dto.subject,
        question: dto.question,
        assigneeId: dto.assigneeId,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        costImpact: dto.costImpact,
        scheduleImpact: dto.scheduleImpact,
      },
    });
  }

  async respond(
    projectId: string,
    id: string,
    dto: RespondRfiDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const rfi = await this.prisma.rfi.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
    });

    if (!rfi) {
      throw new NotFoundException('RFI not found');
    }

    if (rfi.status === 'CLOSED') {
      throw new ForbiddenException('Cannot respond to a closed RFI');
    }

    const response = await this.prisma.rfiResponse.create({
      data: {
        body: dto.body,
        rfiId: id,
        responderId: user.id,
      },
      include: {
        responder: { select: { id: true, email: true } },
      },
    });

    if (rfi.status === 'OPEN') {
      await this.prisma.rfi.update({
        where: { id },
        data: { status: 'RESPONDED' },
      });
    }

    return response;
  }

  async close(
    projectId: string,
    id: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const rfi = await this.prisma.rfi.findFirst({
      where: { id, projectId, project: { orgId: user.orgId } },
    });

    if (!rfi) {
      throw new NotFoundException('RFI not found');
    }

    if (rfi.status === 'CLOSED') {
      throw new ForbiddenException('RFI is already closed');
    }

    return this.prisma.rfi.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        closedById: user.id,
      },
    });
  }
}
