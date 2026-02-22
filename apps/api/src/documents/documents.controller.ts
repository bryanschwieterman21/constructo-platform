import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DocumentsService } from './documents.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { CreateDocumentDto } from './dto/create-document.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // ─── Folders ─────────────────────────────────────────────────────────────

  @Post('projects/:projectId/folders')
  @ApiOperation({ summary: 'Create a folder in a project' })
  createFolder(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: CreateFolderDto,
  ) {
    return this.documentsService.createFolder(projectId, user.orgId, user.id, dto);
  }

  @Get('projects/:projectId/folders')
  @ApiOperation({ summary: 'List folders for a project' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Filter by parent folder ID' })
  getFolders(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Query('parentId') parentId?: string,
  ) {
    return this.documentsService.getFolders(projectId, user.orgId, parentId);
  }

  // ─── Documents ───────────────────────────────────────────────────────────

  @Post('projects/:projectId/documents')
  @ApiOperation({ summary: 'Upload a document (metadata only, file URL from client-side S3 upload)' })
  uploadDocument(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.uploadDocument(projectId, user.orgId, user.id, dto);
  }

  @Get('projects/:projectId/documents')
  @ApiOperation({ summary: 'List documents for a project' })
  @ApiQuery({ name: 'folderId', required: false, description: 'Filter by folder ID' })
  findDocuments(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Query() pagination: PaginationDto,
    @Query('folderId') folderId?: string,
  ) {
    return this.documentsService.findDocuments(projectId, user.orgId, pagination, folderId);
  }

  @Get('projects/:projectId/documents/:id')
  @ApiOperation({ summary: 'Get a single document by ID' })
  findOneDocument(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.documentsService.findOneDocument(id, projectId, user.orgId);
  }

  @Delete('projects/:projectId/documents/:id')
  @ApiOperation({ summary: 'Delete a document' })
  deleteDocument(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.documentsService.deleteDocument(id, projectId, user.orgId);
  }
}
