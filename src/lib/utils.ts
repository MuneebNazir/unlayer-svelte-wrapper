import type { UnlayerDesign, ExportData } from './types.js';

/**
 * Validates if a design object has the correct structure
 */
export function isValidDesign(design: any): design is UnlayerDesign {
  return (
    typeof design === 'object' &&
    design !== null &&
    (design.body === undefined || typeof design.body === 'object')
  );
}

/**
 * Validates if export data has the correct structure
 */
export function isValidExportData(data: any): data is ExportData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.html === 'string' &&
    typeof data.design === 'object'
  );
}

/**
 * Creates a sample design for testing purposes
 */
export function createSampleDesign(): UnlayerDesign {
  return {
    body: {
      rows: [
        {
          cells: [1],
          columns: [
            {
              contents: [
                {
                  type: 'text',
                  values: {
                    text: '<h1>Welcome!</h1><p>This is a sample email template.</p>',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

/**
 * Sanitizes HTML content for safe display
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Creates a deep copy of an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const copy: any = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  return obj;
}
