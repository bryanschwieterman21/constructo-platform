import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateDrawingSetDto } from './dto/create-drawing-set.dto';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import {
  PaginationDto,
  paginate,
  paginatedResponse,
} from '../common/dto/pagination.dto';

@Injectable()
export class DrawingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSet(
    projectId: string,
    dto: CreateDrawingSetDto,
    user: { id: string; email: string; orgId: string },
  ) {
    return this.prisma.drawingSet.create({
      data: {
        ...dto,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        projectId,
        createdById: user.id,
      },
    });
  }

  async findAllSets(
    projectId: string,
    pagination: PaginationDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const where = {
      projectId,
      project: { orgId: user.orgId },
    };

    const { skip, take } = paginate(pagination);

    const [data, total] = await Promise.all([
      this.prisma.drawingSet.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.drawingSet.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async findOneSet(
    projectId: string,
    setId: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const drawingSet = await this.prisma.drawingSet.findFirst({
      where: {
        id: setId,
        projectId,
        project: { orgId: user.orgId },
      },
      include: {
        drawings: {
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!drawingSet) {
      throw new NotFoundException('Drawing set not found');
    }

    return drawingSet;
  }

  async createDrawing(
    projectId: string,
    setId: string,
    dto: CreateDrawingDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOneSet(projectId, setId, user);

    return this.prisma.drawing.create({
      data: {
        ...dto,
        drawingSetId: setId,
      },
    });
  }

  async findOneDrawing(
    projectId: string,
    drawingId: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const drawing = await this.prisma.drawing.findFirst({
      where: {
        id: drawingId,
        drawingSet: {
          projectId,
          project: { orgId: user.orgId },
        },
      },
      include: {
        revisions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!drawing) {
      throw new NotFoundException('Drawing not found');
    }

    return drawing;
  }

  async addRevision(
    projectId: string,
    drawingId: string,
    dto: CreateRevisionDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOneDrawing(projectId, drawingId, user);

    const [revision] = await this.prisma.$transaction([
      this.prisma.drawingRevision.create({
        data: {
          ...dto,
          drawingId,
          uploadedById: user.id,
        },
      }),
      this.prisma.drawing.update({
        where: { id: drawingId },
        data: { currentRev: dto.revision },
      }),
    ]);

    return revision;
  }
}
