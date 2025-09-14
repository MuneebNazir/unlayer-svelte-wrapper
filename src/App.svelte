<script lang="ts">
  import UnlayerEditor from './lib/UnlayerEditor.svelte';
  import ExportModal from './lib/ExportModal.svelte';

  // Component references
  let unlayerEditor: any;

  // State
  let isEditorLoaded = false;
  let showExportModal = false;
  let exportData: any = null;
  let currentDesign: any = null;
  let previewHtml: string = '';
  let showPreview = false;

  // Sample design for testing
  const sampleDesign = {
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
                    text: '<h1>Welcome to Unlayer!</h1><p>This is a sample email template created with the Unlayer email editor.</p>'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  };

  // Event handlers
  function handleEditorLoaded(event: CustomEvent) {
    console.log('App received loaded event:', event.detail);
    isEditorLoaded = true;
  }

  function handleDesignUpdated(event: CustomEvent) {
    console.log('App received design-updated event:', event.detail);
    currentDesign = event.detail;
  }

  function handleExportHtml(event: CustomEvent) {
    console.log('App received export-html event:', event.detail);
    exportData = event.detail;
    showExportModal = true;
  }

  // Button actions
  async function loadSampleDesign() {
    if (!unlayerEditor || !isEditorLoaded) {
      alert('Editor is not ready yet');
      return;
    }

    try {
      unlayerEditor.loadDesign(sampleDesign);
      console.log('Sample design loaded');
    } catch (error) {
      console.error('Failed to load sample design:', error);
      alert('Failed to load sample design');
    }
  }

  async function exportHtml() {
    if (!unlayerEditor || !isEditorLoaded) {
      alert('Editor is not ready yet');
      return;
    }

    try {
      // Pass true to dispatch the event and show the export modal
      const data = await unlayerEditor.exportHtml(true);
      exportData = data;
      showExportModal = true;
    } catch (error) {
      console.error('Failed to export HTML:', error);
      alert('Failed to export HTML');
    }
  }

  async function previewDesign() {
    if (!unlayerEditor || !isEditorLoaded) {
      alert('Editor is not ready yet');
      return;
    }

    try {
      // Pass false (default) to NOT dispatch the event
      const data = await unlayerEditor.exportHtml(false);
      previewHtml = data.html;
      showPreview = true;
    } catch (error) {
      console.error('Failed to preview design:', error);
      alert('Failed to preview design');
    }
  }

  function closePreview() {
    showPreview = false;
    previewHtml = '';
  }

  function handleModalClose() {
    showExportModal = false;
    exportData = null;
  }

  function handleDownload(event: CustomEvent) {
    console.log('Downloaded:', event.detail);
  }

  // Keyboard event handlers for accessibility
  function handlePreviewOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closePreview();
    }
  }

  // Handle clicks on the overlay (but not on the content)
  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closePreview();
    }
  }
</script>

<main class="app">
  <header class="app-header">
    <h1>Unlayer Svelte Wrapper Demo</h1>
    <div class="controls">
      <button 
        on:click={loadSampleDesign} 
        disabled={!isEditorLoaded}
        class="btn btn-secondary"
      >
        Load Sample Design
      </button>
      
      <button 
        on:click={exportHtml} 
        disabled={!isEditorLoaded}
        class="btn btn-primary"
      >
        Export HTML
      </button>
      
      <button 
        on:click={previewDesign} 
        disabled={!isEditorLoaded}
        class="btn btn-secondary"
      >
        Preview
      </button>
    </div>
  </header>

  <div class="editor-container">
    <UnlayerEditor
      bind:this={unlayerEditor}
      options={{ displayMode: 'email' }}
      on:loaded={handleEditorLoaded}
      on:design-updated={handleDesignUpdated}
      on:export-html={handleExportHtml}
    />
  </div>

  <!-- Export Modal -->
  <ExportModal
    bind:show={showExportModal}
    {exportData}
    on:close={handleModalClose}
    on:download={handleDownload}
  />

  <!-- Preview Modal -->
  {#if showPreview}
    <div 
      class="preview-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="preview-title"
      on:click={handleOverlayClick}
      on:keydown={handlePreviewOverlayKeydown}
      tabindex="-1"
    >
      <div class="preview-content">
        <div class="preview-header">
          <h2 id="preview-title">Email Preview</h2>
          <button 
            class="close-btn" 
            on:click={closePreview}
            aria-label="Close preview modal"
          >
            &times;
          </button>
        </div>
        <div class="preview-body">
          <iframe
            srcdoc={previewHtml}
            title="Email Preview"
            class="preview-iframe"
          ></iframe>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .app-header {
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .app-header h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .controls {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: #007acc;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #005a9e;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #545b62;
  }

  .editor-container {
    flex: 1;
    min-height: 0;
    padding: 1rem;
  }

  /* Preview Modal Styles */
  .preview-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .preview-overlay:focus {
    outline: none;
  }

  .preview-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    height: 90%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }

  .preview-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #333;
  }

  .close-btn:focus {
    outline: 2px solid #007acc;
    outline-offset: 2px;
  }

  .preview-body {
    flex: 1;
    padding: 1rem;
  }

  .preview-iframe {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>
