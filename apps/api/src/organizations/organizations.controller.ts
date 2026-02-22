import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @CurrentUser() user: { id: string },
    @Body() createOrgDto: CreateOrgDto,
  ) {
    return this.organizationsService.create(createOrgDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Organization returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateOrgDto: UpdateOrgDto,
  ) {
    return this.organizationsService.update(id, updateOrgDto);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List members of an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Organization members returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  async listMembers(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.organizationsService.listMembers(id, paginationDto);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite a member to an organization' })
  @ApiParam({ name: 'id', description: 'Organization ID' })
  @ApiResponse({ status: 201, description: 'Member invited successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Organization or user not found.' })
  @ApiResponse({ status: 409, description: 'User is already a member.' })
  async inviteMember(
    @Param('id') id: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.organizationsService.inviteMember(id, inviteMemberDto);
  }
}
