import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubmittalsService } from './submittals.service';
import { CreateSubmittalDto } from './dto/create-submittal.dto';
import { UpdateSubmittalDto } from './dto/update-submittal.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Submittals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/submittals')
export class SubmittalsController {
  constructor(private readonly submittalsService: SubmittalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new submittal' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiResponse({ status: 201, description: 'Submittal created successfully' })
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateSubmittalDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.submittalsService.create(projectId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all submittals for a project' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by submittal status' })
  @ApiResponse({ status: 200, description: 'Paginated list of submittals' })
  findAll(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() pagination: PaginationDto,
    @Query('status') status: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.submittalsService.findAll(projectId, pagination, user, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single submittal with revisions' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Submittal details' })
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.submittalsService.findOne(projectId, id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a submittal' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Submittal updated successfully' })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubmittalDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.submittalsService.update(projectId, id, dto, user);
  }

  @Post(':id/revisions')
  @ApiOperation({ summary: 'Add a new revision to a submittal' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 201, description: 'Revision added to submittal' })
  addRevision(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRevisionDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.submittalsService.addRevision(projectId, id, dto, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change the status of a submittal' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Submittal status updated' })
  changeStatus(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.submittalsService.changeStatus(projectId, id, dto, user);
  }
}
