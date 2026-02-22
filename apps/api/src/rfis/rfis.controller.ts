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
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RfisService } from './rfis.service';
import { CreateRfiDto } from './dto/create-rfi.dto';
import { UpdateRfiDto } from './dto/update-rfi.dto';
import { RespondRfiDto } from './dto/respond-rfi.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('RFIs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/rfis')
export class RfisController {
  constructor(private readonly rfisService: RfisService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new RFI' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiResponse({ status: 201, description: 'RFI created successfully' })
  create(
    @Param('projectId')projectId: string,
    @Body() dto: CreateRfiDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.rfisService.create(projectId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all RFIs for a project' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by RFI status' })
  @ApiResponse({ status: 200, description: 'Paginated list of RFIs' })
  findAll(
    @Param('projectId')projectId: string,
    @Query() pagination: PaginationDto,
    @Query('status') status: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.rfisService.findAll(projectId, pagination, user, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single RFI with responses and attachments' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'RFI details' })
  findOne(
    @Param('projectId')projectId: string,
    @Param('id')id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.rfisService.findOne(projectId, id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an RFI' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'RFI updated successfully' })
  update(
    @Param('projectId')projectId: string,
    @Param('id')id: string,
    @Body() dto: UpdateRfiDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.rfisService.update(projectId, id, dto, user);
  }

  @Post(':id/respond')
  @ApiOperation({ summary: 'Respond to an RFI' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 201, description: 'Response added to RFI' })
  respond(
    @Param('projectId')projectId: string,
    @Param('id')id: string,
    @Body() dto: RespondRfiDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.rfisService.respond(projectId, id, dto, user);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close an RFI' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'RFI closed successfully' })
  close(
    @Param('projectId')projectId: string,
    @Param('id')id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.rfisService.close(projectId, id, user);
  }
}
