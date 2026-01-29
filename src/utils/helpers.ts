import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`
}

export function getRiskLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'high':
      return 'text-danger-700 bg-danger-50 border-danger-200'
    case 'medium':
      return 'text-warning-700 bg-warning-50 border-warning-200'
    case 'low':
      return 'text-success-700 bg-success-50 border-success-200'
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}

export function formatTimestamp(timestamp?: string): string {
  if (!timestamp) return 'Just now'
  return new Date(timestamp).toLocaleString()
}

export function truncateCode(code: string, maxLength: number = 100): string {
  if (code.length <= maxLength) return code
  return code.substring(0, maxLength) + '...'
}

export function formatVulnerabilityType(type: string): string {
  return type
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function calculateOverallScore(
  accuracy?: number,
  f1Score?: number,
  precision?: number,
  recall?: number
): number {
  const metrics = [accuracy, f1Score, precision, recall].filter(m => m !== undefined) as number[]
  if (metrics.length === 0) return 0
  return metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}