import {
  Controller,
  Get,
  Post,
  Patch,
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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.projectsService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects for the organization' })
  @ApiResponse({ status: 200, description: 'Paginated list of projects' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.projectsService.findAll(paginationDto, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project details' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.projectsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.projectsService.update(id, dto, user);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to a project' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 409, description: 'User is already a member' })
  addMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.projectsService.addMember(id, dto, user);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List all members of a project' })
  @ApiResponse({ status: 200, description: 'List of project members' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  listMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.projectsService.listMembers(id, user);
  }
}
