import type { UnlayerDesign, ExportData } from './types.js';
/**
 * Validates if a design object has the correct structure
 */
export declare function isValidDesign(design: any): design is UnlayerDesign;
/**
 * Validates if export data has the correct structure
 */
export declare function isValidExportData(data: any): data is ExportData;
/**
 * Creates a sample design for testing purposes
 */
export declare function createSampleDesign(): UnlayerDesign;
/**
 * Sanitizes HTML content for safe display
 */
export declare function sanitizeHtml(html: string): string;
/**
 * Formats file size in human-readable format
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Debounces a function call
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Creates a deep copy of an object
 */
export declare function deepClone<T>(obj: T): T;
//# sourceMappingURL=utils.d.ts.map