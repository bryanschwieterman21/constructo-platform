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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FinancialService } from './financial.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { CreateLineItemDto } from './dto/create-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { CreateChangeOrderDto } from './dto/create-change-order.dto';
import { UpdateChangeOrderDto } from './dto/update-change-order.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@ApiTags('Financial')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  // ─── Budgets ─────────────────────────────────────────────────────────────

  @Post('projects/:projectId/budgets')
  @ApiOperation({ summary: 'Create a budget for a project' })
  createBudget(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: CreateBudgetDto,
  ) {
    return this.financialService.createBudget(projectId, user.orgId, user.id, dto);
  }

  @Get('projects/:projectId/budgets')
  @ApiOperation({ summary: 'List budgets for a project' })
  findBudgets(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Query() pagination: PaginationDto,
  ) {
    return this.financialService.findBudgets(projectId, user.orgId, pagination);
  }

  @Get('projects/:projectId/budgets/:budgetId')
  @ApiOperation({ summary: 'Get a budget with its line items' })
  findOneBudget(
    @Param('projectId') projectId: string,
    @Param('budgetId') budgetId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.financialService.findOneBudget(budgetId, projectId, user.orgId);
  }

  @Post('projects/:projectId/budgets/:budgetId/line-items')
  @ApiOperation({ summary: 'Add a line item to a budget' })
  addLineItem(
    @Param('projectId') projectId: string,
    @Param('budgetId') budgetId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: CreateLineItemDto,
  ) {
    return this.financialService.addLineItem(budgetId, projectId, user.orgId, user.id, dto);
  }

  @Patch('projects/:projectId/budgets/:budgetId/line-items/:lineItemId')
  @ApiOperation({ summary: 'Update a budget line item' })
  updateLineItem(
    @Param('projectId') projectId: string,
    @Param('budgetId') budgetId: string,
    @Param('lineItemId') lineItemId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: UpdateLineItemDto,
  ) {
    return this.financialService.updateLineItem(lineItemId, budgetId, projectId, user.orgId, dto);
  }

  // ─── Contracts ───────────────────────────────────────────────────────────

  @Post('projects/:projectId/contracts')
  @ApiOperation({ summary: 'Create a contract for a project' })
  createContract(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: CreateContractDto,
  ) {
    return this.financialService.createContract(projectId, user.orgId, user.id, dto);
  }

  @Get('projects/:projectId/contracts')
  @ApiOperation({ summary: 'List contracts for a project' })
  findContracts(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Query() pagination: PaginationDto,
  ) {
    return this.financialService.findContracts(projectId, user.orgId, pagination);
  }

  @Get('projects/:projectId/contracts/:contractId')
  @ApiOperation({ summary: 'Get a contract with change orders and invoices' })
  findOneContract(
    @Param('projectId') projectId: string,
    @Param('contractId') contractId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
  ) {
    return this.financialService.findOneContract(contractId, projectId, user.orgId);
  }

  @Patch('projects/:projectId/contracts/:contractId')
  @ApiOperation({ summary: 'Update a contract' })
  updateContract(
    @Param('projectId') projectId: string,
    @Param('contractId') contractId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: UpdateContractDto,
  ) {
    return this.financialService.updateContract(contractId, projectId, user.orgId, dto);
  }

  // ─── Change Orders ───────────────────────────────────────────────────────

  @Post('projects/:projectId/change-orders')
  @ApiOperation({ summary: 'Create a change order for a project' })
  createChangeOrder(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: CreateChangeOrderDto,
  ) {
    return this.financialService.createChangeOrder(projectId, user.orgId, user.id, dto);
  }

  @Get('projects/:projectId/change-orders')
  @ApiOperation({ summary: 'List change orders for a project' })
  findChangeOrders(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Query() pagination: PaginationDto,
  ) {
    return this.financialService.findChangeOrders(projectId, user.orgId, pagination);
  }

  @Patch('projects/:projectId/change-orders/:id')
  @ApiOperation({ summary: 'Update a change order' })
  updateChangeOrder(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: UpdateChangeOrderDto,
  ) {
    return this.financialService.updateChangeOrder(id, projectId, user.orgId, dto);
  }

  // ─── Invoices ────────────────────────────────────────────────────────────

  @Post('projects/:projectId/contracts/:contractId/invoices')
  @ApiOperation({ summary: 'Create an invoice under a contract' })
  createInvoice(
    @Param('projectId') projectId: string,
    @Param('contractId') contractId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.financialService.createInvoice(contractId, projectId, user.orgId, user.id, dto);
  }

  @Get('projects/:projectId/invoices')
  @ApiOperation({ summary: 'List invoices for a project' })
  findInvoices(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Query() pagination: PaginationDto,
  ) {
    return this.financialService.findInvoices(projectId, user.orgId, pagination);
  }

  @Patch('projects/:projectId/invoices/:id')
  @ApiOperation({ summary: 'Update an invoice' })
  updateInvoice(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @CurrentUser() user: { id: string; email: string; orgId: string },
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.financialService.updateInvoice(id, projectId, user.orgId, dto);
  }
}
