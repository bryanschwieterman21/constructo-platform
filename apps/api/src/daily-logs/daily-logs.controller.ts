import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DailyLogsService } from './daily-logs.service';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';
import { CreateManpowerDto } from './dto/create-manpower.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Daily Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a daily log for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateDailyLogDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.dailyLogsService.create(projectId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List daily logs for a project (paginated)' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter end date (ISO 8601)' })
  findAll(
    @Param('projectId') projectId: string,
    @Query() pagination: PaginationDto,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.dailyLogsService.findAll(projectId, pagination, user, {
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a daily log with manpower logs' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Daily Log ID' })
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.dailyLogsService.findOne(projectId, id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a daily log' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Daily Log ID' })
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDailyLogDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.dailyLogsService.update(projectId, id, dto, user);
  }

  @Post(':id/manpower')
  @ApiOperation({ summary: 'Add a manpower log entry' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Daily Log ID' })
  addManpower(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: CreateManpowerDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.dailyLogsService.addManpower(projectId, id, dto, user);
  }

  @Patch(':id/manpower/:manpowerId')
  @ApiOperation({ summary: 'Update a manpower log entry' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'id', description: 'Daily Log ID' })
  @ApiParam({ name: 'manpowerId', description: 'Manpower Log ID' })
  updateManpower(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('manpowerId') manpowerId: string,
    @Body() dto: CreateManpowerDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.dailyLogsService.updateManpower(
      projectId,
      id,
      manpowerId,
      dto,
      user,
    );
  }
}
