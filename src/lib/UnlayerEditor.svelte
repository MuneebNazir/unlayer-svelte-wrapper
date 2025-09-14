<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import type { 
    UnlayerOptions, 
    UnlayerDesign, 
    ExportData, 
    UnlayerInstance,
    EditorLoadedEvent,
    DesignUpdatedEvent,
    ExportHtmlEvent,
    LoadingState
  } from './types';

  // ============================================================================
  // PROPS
  // ============================================================================
  
  /** Initial design JSON to load into the editor */
  export let design: UnlayerDesign | null = null;
  
  /** Tool whitelist/blacklist configuration */
  export let tools: Record<string, any> | null = null;
  
  /** Unlayer initialization options */
  export let options: UnlayerOptions = {};

  // ============================================================================
  // EVENT DISPATCHER
  // ============================================================================
  
  const dispatch = createEventDispatcher<{
    loaded: EditorLoadedEvent;
    'design-updated': DesignUpdatedEvent;
    'export-html': ExportHtmlEvent;
  }>();

  // ============================================================================
  // COMPONENT STATE
  // ============================================================================
  
  /** Reference to the Unlayer editor instance */
  let editor: UnlayerInstance | null = null;
  
  /** Whether the editor is fully initialized and ready */
  let isEditorReady = false;
  
  /** Whether the component is currently loading */
  let isLoading = true;
  
  /** Error message if initialization fails */
  let loadError: string | null = null;
  
  /** Reference to the container DOM element */
  let containerElement: HTMLElement;

  /** Unique container ID to avoid conflicts with multiple instances */
  const containerId = `unlayer-container-${Math.random().toString(36).substr(2, 9)}`;

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  
  onMount(() => {
    loadUnlayerScript();
  });

  onDestroy(() => {
    cleanup();
  });

  // ============================================================================
  // SCRIPT LOADING & INITIALIZATION
  // ============================================================================
  
  /**
   * Loads the Unlayer script dynamically and initializes the editor
   */
  function loadUnlayerScript(): void {
    // Check if script is already loaded
    if (isUnlayerAvailable()) {
      initEditor();
      return;
    }

    // Check if script is already being loaded
    const existingScript = findExistingScript();
    if (existingScript) {
      attachScriptListeners(existingScript);
      return;
    }

    // Load the script for the first time
    createAndLoadScript();
  }

  /**
   * Checks if Unlayer is available globally
   */
  function isUnlayerAvailable(): boolean {
    return typeof (window as any).unlayer !== 'undefined';
  }

  /**
   * Finds existing Unlayer script tag
   */
  function findExistingScript(): HTMLScriptElement | null {
    return document.querySelector('script[src="https://editor.unlayer.com/embed.js"]');
  }

  /**
   * Attaches event listeners to existing script
   */
  function attachScriptListeners(script: HTMLScriptElement): void {
    script.addEventListener('load', initEditor);
    script.addEventListener('error', handleScriptError);
  }

  /**
   * Creates and loads the Unlayer script
   */
  function createAndLoadScript(): void {
    const script = document.createElement('script');
    script.src = 'https://editor.unlayer.com/embed.js';
    script.onload = initEditor;
    script.onerror = handleScriptError;
    document.head.appendChild(script);
  }

  /**
   * Handles script loading errors
   */
  function handleScriptError(): void {
    loadError = 'Failed to load Unlayer script. Please check your internet connection.';
    isLoading = false;
  }

  /**
   * Initializes the Unlayer editor once the script is loaded
   */
  function initEditor(): void {
    console.log('Script loaded, attempting to initialize editor...');
    
    if (!isUnlayerAvailable()) {
      setError('Unlayer script loaded but global object not available.');
      return;
    }

    waitForContainerAndInit();
  }

  /**
   * Waits for the container element to be available and initializes the editor
   */
  function waitForContainerAndInit(): void {
    const container = document.getElementById(containerId);
    console.log('Looking for container:', containerId, 'Found:', !!container);
    
    if (!container) {
      console.log('Container not found, retrying in 100ms...');
      setTimeout(waitForContainerAndInit, 100);
      return;
    }

    performEditorInitialization();
  }

  /**
   * Performs the actual editor initialization
   */
  function performEditorInitialization(): void {
    try {
      console.log('Container found, initializing editor...');
      
      const initOptions = buildInitOptions();
      console.log('Initializing with options:', initOptions);

      // Initialize the editor
      (window as any).unlayer.init(initOptions);
      
      // Set editor reference
      editor = (window as any).unlayer;
      console.log('Editor initialized:', editor);

      // Load initial design if provided
      loadInitialDesign();

      // Set up event listeners
      setupEventListeners();
      
      // Mark as ready and dispatch event
      finalizeInitialization();

    } catch (error) {
      console.error('Error initializing editor:', error);
      setError(`Failed to initialize editor: ${(error as Error).message}`);
    }
  }

  /**
   * Builds the initialization options object
   */
  function buildInitOptions(): UnlayerOptions {
    const initOptions: UnlayerOptions = {
      id: containerId,
      displayMode: 'email',
      ...options
    };

    // Add tools configuration if provided
    if (tools) {
      initOptions.tools = tools;
    }

    return initOptions;
  }

  /**
   * Loads the initial design if provided
   */
  function loadInitialDesign(): void {
    if (design && editor) {
      editor.loadDesign(design);
    }
  }

  /**
   * Sets up event listeners for the editor
   */
  function setupEventListeners(): void {
    if (!editor) return;

    try {
      // Listen for design changes
      if (editor.addEventListener) {
        editor.addEventListener('design:updated', handleDesignUpdate);
      }
    } catch (error) {
      console.warn('Could not set up event listeners:', error);
    }
  }

  /**
   * Handles design update events from the editor
   */
  function handleDesignUpdate(data: UnlayerDesign): void {
    console.log('Design updated:', data);
    dispatch('design-updated', data);
  }

  /**
   * Finalizes the initialization process
   */
  function finalizeInitialization(): void {
    isLoading = false;
    isEditorReady = true;
    
    console.log('Dispatching loaded event...');
    dispatch('loaded', { editor: editor! });
  }

  /**
   * Sets an error message and stops loading
   */
  function setError(message: string): void {
    loadError = message;
    isLoading = false;
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================
  
  /**
   * Cleans up the editor instance and resets state
   */
  function cleanup(): void {
    if (editor?.destroy) {
      try {
        editor.destroy();
      } catch (error) {
        console.warn('Error destroying editor:', error);
      }
    }
    
    resetState();
  }

  /**
   * Resets component state
   */
  function resetState(): void {
    editor = null;
    isEditorReady = false;
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================
  
  /**
   * Exports the current design as HTML and JSON
   * @param dispatchEvent - Whether to dispatch the export-html event
   * @returns Promise resolving to the export data
   */
  export function exportHtml(dispatchEvent = false): Promise<ExportData> {
    return new Promise((resolve, reject) => {
      if (!isEditorReady || !editor) {
        reject(new Error('Editor is not ready'));
        return;
      }

      try {
        editor.exportHtml((data: ExportData) => {
          // Only dispatch event if explicitly requested
          if (dispatchEvent) {
            dispatch('export-html', data);
          }
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Loads a new design into the editor
   * @param newDesign - The design JSON to load
   */
  export function loadDesign(newDesign: UnlayerDesign): void {
    if (!isEditorReady || !editor) {
      throw new Error('Editor is not ready');
    }
    
    editor.loadDesign(newDesign);
    design = newDesign;
  }

  /**
   * Saves the current design and returns it
   * @returns Promise resolving to the current design
   */
  export function saveDesign(): Promise<UnlayerDesign> {
    return new Promise((resolve, reject) => {
      if (!isEditorReady || !editor) {
        reject(new Error('Editor is not ready'));
        return;
      }

      try {
        editor.saveDesign((data: UnlayerDesign) => {
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gets the raw editor instance
   * @returns The Unlayer editor instance
   */
  export function getEditor(): UnlayerInstance | null {
    return editor;
  }

  /**
   * Checks if the editor is ready for use
   * @returns Whether the editor is initialized and ready
   */
  export function isReady(): boolean {
    return isEditorReady;
  }

  /**
   * Retries initialization after an error
   */
  export function retry(): void {
    loadError = null;
    isLoading = true;
    loadUnlayerScript();
  }
</script>

<div class="unlayer-editor-wrapper">
  {#if loadError}
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Failed to Load Editor</h3>
      <p>{loadError}</p>
      <button on:click={retry} class="retry-button">
        Retry
      </button>
    </div>
  {:else}
    <!-- Always render the container, show loading overlay when needed -->
    <div class="editor-container">
      <div id={containerId} bind:this={containerElement} class="unlayer-container"></div>
      
      {#if isLoading}
        <div class="loading-overlay">
          <div class="loading-content">
            <div class="spinner"></div>
            <p>Loading Unlayer Editor...</p>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .unlayer-editor-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .editor-container {
    width: 100%;
    height: 100%;
    position: relative;
    flex: 1;
  }

  .unlayer-container {
    width: 100%;
    height: 100%;
    min-height: 500px;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 400px;
    padding: 40px;
    text-align: center;
    color: #d32f2f;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007acc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-content p {
    color: #666;
    font-size: 16px;
    margin: 0;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-state h3 {
    margin: 0 0 12px 0;
    font-size: 20px;
  }

  .error-state p {
    margin: 0 0 20px 0;
    color: #666;
    max-width: 400px;
    line-height: 1.5;
  }

  .error-state button {
    background-color: #007acc;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .error-state button:hover {
    background-color: #005a9e;
  }
</style>
