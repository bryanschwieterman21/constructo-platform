import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PaginationDto, paginate, paginatedResponse } from '../common/dto/pagination.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { CreateLineItemDto } from './dto/create-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { CreateChangeOrderDto } from './dto/create-change-order.dto';
import { UpdateChangeOrderDto } from './dto/update-change-order.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Budgets ───────────────────────────────────────────────────────────────

  async createBudget(
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateBudgetDto,
  ) {
    return this.prisma.budget.create({
      data: {
        ...dto,
        projectId,
        createdById: userId,
      },
    });
  }

  async findBudgets(projectId: string, orgId: string, pagination: PaginationDto) {
    const { skip, take } = paginate(pagination);
    const where = { projectId, project: { orgId } };

    const [data, total] = await Promise.all([
      this.prisma.budget.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.budget.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async findOneBudget(budgetId: string, projectId: string, orgId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id: budgetId, projectId, project: { orgId } },
      include: { lineItems: true },
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${budgetId} not found`);
    }

    return budget;
  }

  async addLineItem(
    budgetId: string,
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateLineItemDto,
  ) {
    // Verify budget exists and belongs to the org/project
    await this.findOneBudget(budgetId, projectId, orgId);

    return this.prisma.budgetLineItem.create({
      data: {
        ...dto,
        budgetId,
        createdById: userId,
      },
    });
  }

  async updateLineItem(
    lineItemId: string,
    budgetId: string,
    projectId: string,
    orgId: string,
    dto: UpdateLineItemDto,
  ) {
    // Verify budget exists and belongs to the org/project
    await this.findOneBudget(budgetId, projectId, orgId);

    const lineItem = await this.prisma.budgetLineItem.findFirst({
      where: { id: lineItemId, budgetId },
    });

    if (!lineItem) {
      throw new NotFoundException(`Line item with ID ${lineItemId} not found`);
    }

    return this.prisma.budgetLineItem.update({
      where: { id: lineItemId },
      data: dto,
    });
  }

  // ─── Contracts ─────────────────────────────────────────────────────────────

  async createContract(
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateContractDto,
  ) {
    const { startDate, endDate, ...rest } = dto;

    return this.prisma.contract.create({
      data: {
        ...rest,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        projectId,
        createdById: userId,
      },
    });
  }

  async findContracts(projectId: string, orgId: string, pagination: PaginationDto) {
    const { skip, take } = paginate(pagination);
    const where = { projectId, project: { orgId } };

    const [data, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contract.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async findOneContract(contractId: string, projectId: string, orgId: string) {
    const contract = await this.prisma.contract.findFirst({
      where: { id: contractId, projectId, project: { orgId } },
      include: {
        changeOrders: true,
        invoices: true,
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }

    return contract;
  }

  async updateContract(
    contractId: string,
    projectId: string,
    orgId: string,
    dto: UpdateContractDto,
  ) {
    await this.findOneContract(contractId, projectId, orgId);

    const { startDate, endDate, ...rest } = dto;

    return this.prisma.contract.update({
      where: { id: contractId },
      data: {
        ...rest,
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    });
  }

  // ─── Change Orders ─────────────────────────────────────────────────────────

  async createChangeOrder(
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateChangeOrderDto,
  ) {
    const { dueDate, ...rest } = dto;

    // Auto-increment the change order number per project
    const lastCo = await this.prisma.changeOrder.findFirst({
      where: { projectId, project: { orgId } },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    const nextNumber = (lastCo?.number ?? 0) + 1;

    return this.prisma.changeOrder.create({
      data: {
        ...rest,
        number: nextNumber,
        ...(dueDate && { dueDate: new Date(dueDate) }),
        projectId,
        createdById: userId,
      },
    });
  }

  async findChangeOrders(projectId: string, orgId: string, pagination: PaginationDto) {
    const { skip, take } = paginate(pagination);
    const where = { projectId, project: { orgId } };

    const [data, total] = await Promise.all([
      this.prisma.changeOrder.findMany({
        where,
        skip,
        take,
        orderBy: { number: 'desc' },
      }),
      this.prisma.changeOrder.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async updateChangeOrder(
    changeOrderId: string,
    projectId: string,
    orgId: string,
    dto: UpdateChangeOrderDto,
  ) {
    const existing = await this.prisma.changeOrder.findFirst({
      where: { id: changeOrderId, projectId, project: { orgId } },
    });

    if (!existing) {
      throw new NotFoundException(`Change order with ID ${changeOrderId} not found`);
    }

    const { dueDate, ...rest } = dto;

    return this.prisma.changeOrder.update({
      where: { id: changeOrderId },
      data: {
        ...rest,
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });
  }

  // ─── Invoices ──────────────────────────────────────────────────────────────

  async createInvoice(
    contractId: string,
    projectId: string,
    orgId: string,
    userId: string,
    dto: CreateInvoiceDto,
  ) {
    // Verify contract exists and belongs to the project/org
    await this.findOneContract(contractId, projectId, orgId);

    const { periodStart, periodEnd, dueDate, ...rest } = dto;

    return this.prisma.invoice.create({
      data: {
        ...rest,
        ...(periodStart && { periodStart: new Date(periodStart) }),
        ...(periodEnd && { periodEnd: new Date(periodEnd) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        contractId,
        projectId,
        createdById: userId,
      },
    });
  }

  async findInvoices(projectId: string, orgId: string, pagination: PaginationDto) {
    const { skip, take } = paginate(pagination);
    const where = { projectId, project: { orgId } };

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { contract: { select: { id: true, title: true } } },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return paginatedResponse(data, total, pagination);
  }

  async updateInvoice(
    invoiceId: string,
    projectId: string,
    orgId: string,
    dto: UpdateInvoiceDto,
  ) {
    const existing = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, projectId, project: { orgId } },
    });

    if (!existing) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    const { periodStart, periodEnd, dueDate, ...rest } = dto;

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        ...rest,
        ...(periodStart !== undefined && { periodStart: periodStart ? new Date(periodStart) : null }),
        ...(periodEnd !== undefined && { periodEnd: periodEnd ? new Date(periodEnd) : null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });
  }
}
