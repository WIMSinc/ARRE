import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number to K/M/B format
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format date to relative time (today, yesterday, or date)
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date >= today) {
    return 'Today';
  } else if (date >= yesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}

// Helper to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Helper to get status color class
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'complete':
    case 'completed':
      return 'text-success';
    case 'pending':
    case 'in progress':
    case 'in_progress':
      return 'text-warning';
    case 'archived':
    case 'inactive':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
}

// Helper to get property type badge class
export function getPropertyTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'office':
      return 'bg-primary text-white';
    case 'retail':
      return 'bg-secondary text-white';
    case 'mixed-use':
    case 'mixed_use':
      return 'bg-accent text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}
