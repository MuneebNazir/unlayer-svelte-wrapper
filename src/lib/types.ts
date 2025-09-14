// ============================================================================
// UNLAYER TYPES
// ============================================================================

export interface UnlayerOptions {
  id?: string;
  displayMode?: 'email' | 'web' | 'popup';
  projectId?: number;
  locale?: string;
  appearance?: {
    theme?: 'light' | 'dark';
    panels?: {
      tools?: {
        dock?: 'left' | 'right';
      };
    };
    [key: string]: any;
  };
  user?: {
    id?: string | number;
    name?: string;
    email?: string;
    [key: string]: any;
  };
  mergeTags?: Array<{
    name: string;
    value: string;
    sample?: string;
    [key: string]: any;
  }>;
  designTags?: Record<string, any>;
  specialLinks?: Array<{
    name: string;
    href: string;
    target?: string;
    [key: string]: any;
  }>;
  tools?: {
    enabled?: string[];
    disabled?: string[];
    [key: string]: any;
  };
  blocks?: Array<Record<string, any>>;
  editor?: {
    minRows?: number;
    maxRows?: number;
    [key: string]: any;
  };
  fonts?: {
    customFonts?: Array<{
      name: string;
      family: string;
      url: string;
    }>;
    [key: string]: any;
  };
  customJS?: Array<string>;
  customCSS?: Array<string>;
  textDirection?: 'ltr' | 'rtl';
  [key: string]: any;
}

export interface UnlayerDesign {
  body?: {
    rows?: Array<{
      cells?: number[];
      columns?: Array<{
        contents?: Array<{
          type: string;
          values: Record<string, any>;
        }>;
      }>;
    }>;
  };
  [key: string]: any;
}

export interface ExportData {
  html: string;
  design: UnlayerDesign;
}

export interface UnlayerInstance {
  init: (options: UnlayerOptions) => void;
  loadDesign: (design: UnlayerDesign) => void;
  saveDesign: (callback: (data: UnlayerDesign) => void) => void;
  exportHtml: (callback: (data: ExportData) => void) => void;
  exportImage?: (callback: (data: { url: string }) => void, options?: Record<string, any>) => void;
  exportPdf?: (callback: (data: { url: string }) => void, options?: Record<string, any>) => void;
  exportZip?: (callback: (data: { url: string }) => void) => void;
  addEventListener?: (event: string, callback: (data: any) => void) => void;
  removeEventListener?: (event: string, callback: (data: any) => void) => void;
  destroy?: () => void;
  setDesignMode?: (mode: string) => void;
  setDisplayMode?: (mode: 'email' | 'web' | 'popup') => void;
  showPreview?: () => void;
  hidePreview?: () => void;
  [key: string]: any;
}

// ============================================================================
// COMPONENT EVENT TYPES
// ============================================================================

export interface EditorLoadedEvent {
  editor: UnlayerInstance;
}

export interface DesignUpdatedEvent extends UnlayerDesign {}

export interface ExportHtmlEvent extends ExportData {}

export interface DownloadEvent {
  type: 'html' | 'json' | 'zip';
  filename: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface UnlayerEditorProps {
  design?: UnlayerDesign | null;
  tools?: Record<string, any> | null;
  options?: UnlayerOptions;
}

export interface ExportModalProps {
  show?: boolean;
  exportData?: ExportData | null;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

export interface ComponentError {
  message: string;
  code?: string;
  details?: any;
} 