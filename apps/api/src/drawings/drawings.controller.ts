import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DrawingsService } from './drawings.service';
import { CreateDrawingSetDto } from './dto/create-drawing-set.dto';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Drawings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DrawingsController {
  constructor(private readonly drawingsService: DrawingsService) {}

  @Post('projects/:projectId/drawing-sets')
  @ApiOperation({ summary: 'Create a drawing set for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  createSet(
    @Param('projectId') projectId: string,
    @Body() dto: CreateDrawingSetDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.drawingsService.createSet(projectId, dto, user);
  }

  @Get('projects/:projectId/drawing-sets')
  @ApiOperation({ summary: 'List drawing sets for a project (paginated)' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  findAllSets(
    @Param('projectId') projectId: string,
    @Query() pagination: PaginationDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.drawingsService.findAllSets(projectId, pagination, user);
  }

  @Get('projects/:projectId/drawing-sets/:setId')
  @ApiOperation({ summary: 'Get a drawing set with its drawings' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'setId', description: 'Drawing Set ID' })
  findOneSet(
    @Param('projectId') projectId: string,
    @Param('setId') setId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.drawingsService.findOneSet(projectId, setId, user);
  }

  @Post('projects/:projectId/drawing-sets/:setId/drawings')
  @ApiOperation({ summary: 'Create a drawing in a drawing set' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'setId', description: 'Drawing Set ID' })
  createDrawing(
    @Param('projectId') projectId: string,
    @Param('setId') setId: string,
    @Body() dto: CreateDrawingDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.drawingsService.createDrawing(projectId, setId, dto, user);
  }

  @Get('projects/:projectId/drawings/:drawingId')
  @ApiOperation({ summary: 'Get a drawing with its revisions' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'drawingId', description: 'Drawing ID' })
  findOneDrawing(
    @Param('projectId') projectId: string,
    @Param('drawingId') drawingId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.drawingsService.findOneDrawing(projectId, drawingId, user);
  }

  @Post('projects/:projectId/drawings/:drawingId/revisions')
  @ApiOperation({ summary: 'Add a revision to a drawing' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'drawingId', description: 'Drawing ID' })
  addRevision(
    @Param('projectId') projectId: string,
    @Param('drawingId') drawingId: string,
    @Body() dto: CreateRevisionDto,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.drawingsService.addRevision(projectId, drawingId, dto, user);
  }
}
