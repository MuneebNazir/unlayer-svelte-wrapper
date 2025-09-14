import type { UnlayerOptions, UnlayerDesign, ExportData, UnlayerInstance, EditorLoadedEvent, DesignUpdatedEvent, ExportHtmlEvent } from './types';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const UnlayerEditor: $$__sveltets_2_IsomorphicComponent<{
    /** Initial design JSON to load into the editor */ design?: UnlayerDesign | null;
    /** Tool whitelist/blacklist configuration */ tools?: Record<string, any> | null;
    /** Unlayer initialization options */ options?: UnlayerOptions;
    exportHtml?: (dispatchEvent?: boolean) => Promise<ExportData>;
    loadDesign?: (newDesign: UnlayerDesign) => void;
    saveDesign?: () => Promise<UnlayerDesign>;
    getEditor?: () => UnlayerInstance | null;
    isReady?: () => boolean;
    retry?: () => void;
}, {
    loaded: CustomEvent<EditorLoadedEvent>;
    'design-updated': CustomEvent<DesignUpdatedEvent>;
    'export-html': CustomEvent<ExportHtmlEvent>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {
    exportHtml: (dispatchEvent?: boolean) => Promise<ExportData>;
    loadDesign: (newDesign: UnlayerDesign) => void;
    saveDesign: () => Promise<UnlayerDesign>;
    getEditor: () => UnlayerInstance | null;
    isReady: () => boolean;
    retry: () => void;
}, string>;
type UnlayerEditor = InstanceType<typeof UnlayerEditor>;
export default UnlayerEditor;
//# sourceMappingURL=UnlayerEditor.svelte.d.ts.map