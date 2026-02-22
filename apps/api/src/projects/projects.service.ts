import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import {
  PaginationDto,
  paginate,
  paginatedResponse,
} from '../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateProjectDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const data: any = {
      ...dto,
      orgId: user.orgId,
    };

    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      data.endDate = new Date(dto.endDate);
    }

    return this.prisma.project.create({ data });
  }

  async findAll(
    paginationDto: PaginationDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const where = { orgId: user.orgId };
    const { skip, take } = paginate(paginationDto);

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return paginatedResponse(items, total, paginationDto);
  }

  async findOne(
    id: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id, orgId: user.orgId },
      include: {
        members: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOne(id, user);

    const data: any = { ...dto };

    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      data.endDate = new Date(dto.endDate);
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async addMember(
    projectId: string,
    dto: AddMemberDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOne(projectId, user);

    const existingMember = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: dto.userId },
    });

    if (existingMember) {
      throw new ConflictException(
        `User "${dto.userId}" is already a member of this project`,
      );
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId: dto.userId,
        role: dto.role,
        companyId: dto.companyId,
      },
    });
  }

  async listMembers(
    projectId: string,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOne(projectId, user);

    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: true,
      },
    });
  }
}
