import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DirectoryService } from './directory.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Directory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  // ─── Companies ──────────────────────────────────────────────────────

  @Post('companies')
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  createCompany(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.createCompany(dto, user);
  }

  @Get('companies')
  @ApiOperation({ summary: 'List all companies for the organization' })
  @ApiResponse({ status: 200, description: 'Paginated list of companies' })
  findAllCompanies(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.findAllCompanies(paginationDto, user);
  }

  @Get('companies/:id')
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiResponse({ status: 200, description: 'Company details with contacts' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findOneCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.findOneCompany(id, user);
  }

  @Patch('companies/:id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.updateCompany(id, dto, user);
  }

  @Delete('companies/:id')
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  deleteCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.deleteCompany(id, user);
  }

  // ─── Contacts ───────────────────────────────────────────────────────

  @Post('companies/:companyId/contacts')
  @ApiOperation({ summary: 'Create a contact for a company' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  createContact(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() dto: CreateContactDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.createContact(companyId, dto, user);
  }

  @Get('companies/:companyId/contacts')
  @ApiOperation({ summary: 'List all contacts for a company' })
  @ApiResponse({ status: 200, description: 'List of contacts' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  findAllContacts(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.findAllContacts(companyId, user);
  }

  @Patch('companies/:companyId/contacts/:contactId')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Company or contact not found' })
  updateContact(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: UpdateContactDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.updateContact(companyId, contactId, dto, user);
  }

  @Delete('companies/:companyId/contacts/:contactId')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company or contact not found' })
  deleteContact(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.directoryService.deleteContact(companyId, contactId, user);
  }
}
