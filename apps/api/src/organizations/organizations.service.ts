import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { PaginationDto, paginate, paginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrgDto: CreateOrgDto, userId: string) {
    return this.prisma.organization.create({
      data: {
        ...createOrgDto,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }

    return organization;
  }

  async update(id: string, updateOrgDto: UpdateOrgDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }

    return this.prisma.organization.update({
      where: { id },
      data: updateOrgDto,
    });
  }

  async listMembers(orgId: string, paginationDto: PaginationDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID "${orgId}" not found`);
    }

    const { skip, take } = paginate(paginationDto);

    const [members, total] = await Promise.all([
      this.prisma.orgMember.findMany({
        where: { orgId: orgId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.orgMember.count({ where: { orgId: orgId } }),
    ]);

    return paginatedResponse(members, total, paginationDto);
  }

  async inviteMember(orgId: string, inviteMemberDto: InviteMemberDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID "${orgId}" not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: inviteMemberDto.email },
    });

    if (!user) {
      throw new NotFoundException(
        `User with email "${inviteMemberDto.email}" not found`,
      );
    }

    const existingMembership = await this.prisma.orgMember.findUnique({
      where: {
        userId_orgId: {
          userId: user.id,
          orgId: orgId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException(
        `User "${inviteMemberDto.email}" is already a member of this organization`,
      );
    }

    return this.prisma.orgMember.create({
      data: {
        userId: user.id,
        orgId: orgId,
        role: inviteMemberDto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
