import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import {
  PaginationDto,
  paginate,
  paginatedResponse,
} from '../common/dto/pagination.dto';

@Injectable()
export class DirectoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Companies ──────────────────────────────────────────────────────

  async createCompany(
    dto: CreateCompanyDto,
    user: { id: string; email: string; orgId: string },
  ) {
    return this.prisma.companyDirectory.create({
      data: {
        ...dto,
        orgId: user.orgId,
      },
    });
  }

  async findAllCompanies(
    paginationDto: PaginationDto,
    user: { id: string; email: string; orgId: string },
  ) {
    const where = { orgId: user.orgId };
    const { skip, take } = paginate(paginationDto);

    const [items, total] = await Promise.all([
      this.prisma.companyDirectory.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.companyDirectory.count({ where }),
    ]);

    return paginatedResponse(items, total, paginationDto);
  }

  async findOneCompany(
    id: string,
    user: { id: string; email: string; orgId: string },
  ) {
    const company = await this.prisma.companyDirectory.findFirst({
      where: { id, orgId: user.orgId },
      include: { contacts: true },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID "${id}" not found`);
    }

    return company;
  }

  async updateCompany(
    id: string,
    dto: UpdateCompanyDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOneCompany(id, user);

    return this.prisma.companyDirectory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCompany(
    id: string,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.findOneCompany(id, user);

    return this.prisma.companyDirectory.delete({ where: { id } });
  }

  // ─── Contacts ───────────────────────────────────────────────────────

  private async ensureCompanyAccess(
    companyId: string,
    user: { id: string; email: string; orgId: string },
  ) {
    return this.findOneCompany(companyId, user);
  }

  async createContact(
    companyId: string,
    dto: CreateContactDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.ensureCompanyAccess(companyId, user);

    return this.prisma.contact.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async findAllContacts(
    companyId: string,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.ensureCompanyAccess(companyId, user);

    return this.prisma.contact.findMany({
      where: { companyId },
      orderBy: { lastName: 'asc' },
    });
  }

  async updateContact(
    companyId: string,
    contactId: string,
    dto: UpdateContactDto,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.ensureCompanyAccess(companyId, user);

    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, companyId },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID "${contactId}" not found`);
    }

    return this.prisma.contact.update({
      where: { id: contactId },
      data: dto,
    });
  }

  async deleteContact(
    companyId: string,
    contactId: string,
    user: { id: string; email: string; orgId: string },
  ) {
    await this.ensureCompanyAccess(companyId, user);

    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, companyId },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID "${contactId}" not found`);
    }

    return this.prisma.contact.delete({ where: { id: contactId } });
  }
}
