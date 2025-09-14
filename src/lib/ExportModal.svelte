<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Props
  export let show = false;
  export let exportData: any = null;

  // Event dispatcher
  const dispatch = createEventDispatcher();

  function downloadHtml() {
    if (!exportData) return;
    
    const blob = new Blob([exportData.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    dispatch('download', { type: 'html', filename: 'email-template.html' });
  }

  function downloadJson() {
    if (!exportData) return;
    
    const blob = new Blob([JSON.stringify(exportData.design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-design.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    dispatch('download', { type: 'json', filename: 'email-design.json' });
  }

  function downloadZip() {
    if (!exportData) return;
    
    // For now, download both files separately
    // In a real implementation, you'd use JSZip library
    downloadHtml();
    setTimeout(() => downloadJson(), 100);
    
    dispatch('download', { type: 'zip', filename: 'email-package.zip' });
  }

  function closeModal() {
    show = false;
    dispatch('close');
  }

  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

{#if show}
  <div class="modal-overlay" on:click={handleOverlayClick} role="dialog" aria-modal="true">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Export Options</h2>
        <button class="close-btn" on:click={closeModal} aria-label="Close modal">&times;</button>
      </div>
      
      <div class="export-options">
        <div class="export-option" on:click={downloadHtml} role="button" tabindex="0">
          <div class="export-icon">📄</div>
          <div class="export-info">
            <h3>Download HTML</h3>
            <p>Get the HTML file for your email template.</p>
            <span class="availability">Available for Free</span>
          </div>
        </div>
        
        <div class="export-option" on:click={downloadJson} role="button" tabindex="0">
          <div class="export-icon">🔧</div>
          <div class="export-info">
            <h3>Download JSON</h3>
            <p>Get the design JSON for programmatic use.</p>
            <span class="availability">Available for Free</span>
          </div>
        </div>
        
        <div class="export-option" on:click={downloadZip} role="button" tabindex="0">
          <div class="export-icon">📦</div>
          <div class="export-info">
            <h3>Download Package</h3>
            <p>Get both HTML and JSON files.</p>
            <span class="availability">Available for Free</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
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

  .modal-content {
    background: white;
    border-radius: 8px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
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

  .export-options {
    padding: 20px;
  }

  .export-option {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .export-option:hover {
    border-color: #007acc;
    background-color: #f8f9fa;
  }

  .export-option:focus {
    outline: 2px solid #007acc;
    outline-offset: 2px;
  }

  .export-icon {
    font-size: 24px;
    margin-right: 15px;
    width: 40px;
    text-align: center;
  }

  .export-info {
    flex: 1;
  }

  .export-info h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
    color: #333;
  }

  .export-info p {
    margin: 0 0 5px 0;
    color: #666;
    font-size: 14px;
  }

  .availability {
    color: #28a745;
    font-size: 12px;
    font-weight: 500;
  }
</style>
