import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    OPEN: 'bg-blue-100 text-blue-700',
    ACTIVE: 'bg-green-100 text-green-700',
    PLANNING: 'bg-purple-100 text-purple-700',
    PRE_CONSTRUCTION: 'bg-indigo-100 text-indigo-700',
    ON_HOLD: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    APPROVED_AS_NOTED: 'bg-lime-100 text-lime-700',
    REJECTED: 'bg-red-100 text-red-700',
    REVISE_AND_RESUBMIT: 'bg-orange-100 text-orange-700',
    RESPONDED: 'bg-teal-100 text-teal-700',
    OVERDUE: 'bg-red-100 text-red-700',
    EXECUTED: 'bg-green-100 text-green-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    PAID: 'bg-green-100 text-green-700',
    VOID: 'bg-gray-100 text-gray-500',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
