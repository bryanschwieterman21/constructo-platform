import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PaginationDto, paginate, paginatedResponse } from '../common/dto/pagination.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Folders ─────────────────────────────────────────────────────────────

  async createFolder(
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateFolderDto,
  ) {
    // If a parentId is provided, verify the parent folder exists
    if (dto.parentId) {
      const parentFolder = await this.prisma.folder.findFirst({
        where: { id: dto.parentId, projectId, project: { orgId } },
      });

      if (!parentFolder) {
        throw new NotFoundException(`Parent folder with ID ${dto.parentId} not found`);
      }
    }

    return this.prisma.folder.create({
      data: {
        ...dto,
        projectId,
        createdById: userId,
      },
    });
  }

  async getFolders(
    projectId: string,
    orgId: string,
    parentId?: string,
  ) {
    return this.prisma.folder.findMany({
      where: {
        projectId,
        project: { orgId },
        parentId: parentId ?? null,
      },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            children: true,
            documents: true,
          },
        },
      },
    });
  }

  // ─── Documents ───────────────────────────────────────────────────────────

  async uploadDocument(
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateDocumentDto,
  ) {
    // If a folderId is provided, verify it exists
    if (dto.folderId) {
      const folder = await this.prisma.folder.findFirst({
        where: { id: dto.folderId, projectId, project: { orgId } },
      });

      if (!folder) {
        throw new NotFoundException(`Folder with ID ${dto.folderId} not found`);
      }
    }

    return this.prisma.document.create({
      data: {
        ...dto,
        projectId,
        uploadedById: userId,
      },
    });
  }

  async findDocuments(
    projectId: string,
    orgId: string,
    pagination: PaginationDto,
    folderId?: string,
  ) {
    const { skip, take } = paginate(pagination);

    const where: Record<string, unknown> = { projectId, project: { orgId } };
    if (folderId) {
      where.folderId = folderId;
    }

    const [data, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          folder: { select: { id: true, name: true } },
          uploadedBy: { select: { id: true, email: true } },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async findOneDocument(documentId: string, projectId: string, orgId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, projectId, project: { orgId } },
      include: {
        folder: { select: { id: true, name: true } },
        uploadedBy: { select: { id: true, email: true } },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    return document;
  }

  async deleteDocument(documentId: string, projectId: string, orgId: string) {
    await this.findOneDocument(documentId, projectId, orgId);

    return this.prisma.document.delete({
      where: { id: documentId },
    });
  }
}
