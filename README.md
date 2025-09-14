# Unlayer Svelte Wrapper

A modern, TypeScript-first Svelte wrapper for the [Unlayer](https://unlayer.com/) email editor.

## Features

- 🚀 **Easy Integration** - Drop-in Svelte component
- 📝 **TypeScript Support** - Full type definitions included
- 🎨 **Customizable** - Support for all Unlayer configuration options
- 📱 **Responsive** - Fills parent container width/height
- 🔄 **Event-Driven** - Reactive design updates and exports
- 🧪 **Well Tested** - Comprehensive test coverage
- 📦 **Tree Shakeable** - Import only what you need

## Installation

```bash
npm install @your-username/unlayer-svelte-wrapper
```

## Quick Start

```svelte
<script>
  import { UnlayerEditor } from '@your-username/unlayer-svelte-wrapper';
  
  let editor;
  let isEditorReady = false;

  function handleEditorLoaded(event) {
    isEditorReady = true;
    console.log('Editor loaded:', event.detail.editor);
  }

  async function exportDesign() {
    if (editor && isEditorReady) {
      const data = await editor.exportHtml();
      console.log('Exported:', data);
    }
  }
</script>

<div style="height: 600px;">
  <UnlayerEditor
    bind:this={editor}
    options={{ displayMode: 'email' }}
    on:loaded={handleEditorLoaded}
  />
</div>

<button on:click={exportDesign} disabled={!isEditorReady}>
  Export Design
</button>
```

## API Reference

### UnlayerEditor Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `design` | `UnlayerDesign \| null` | `null` | Initial design JSON to load |
| `tools` | `Record<string, any> \| null` | `null` | Tool whitelist/blacklist configuration |
| `options` | `UnlayerOptions` | `{}` | Unlayer initialization options |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `loaded` | `{ editor: UnlayerInstance }` | Fired when editor is ready |
| `design-updated` | `UnlayerDesign` | Fired when design changes |
| `export-html` | `ExportData` | Fired when HTML is exported |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `exportHtml()` | `dispatchEvent?: boolean` | `Promise<ExportData>` | Export current design as HTML |
| `loadDesign()` | `design: UnlayerDesign` | `void` | Load a design into the editor |
| `saveDesign()` | - | `Promise<UnlayerDesign>` | Get current design JSON |
| `isReady()` | - | `boolean` | Check if editor is ready |
| `getEditor()` | - | `UnlayerInstance \| null` | Get raw editor instance |

### ExportModal Component

A pre-built modal for handling design exports.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | `boolean` | `false` | Whether modal is visible |
| `exportData` | `ExportData \| null` | `null` | Export data to display |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | `void` | Fired when modal is closed |
| `download` | `DownloadEvent` | Fired when download is triggered |

## Advanced Usage

### Custom Configuration

```svelte
<script>
  import { UnlayerEditor } from '@your-username/unlayer-svelte-wrapper';

  const editorOptions = {
    displayMode: 'email',
    projectId: 1234,
    locale: 'en-US',
    appearance: {
      theme: 'light',
      panels: {
        tools: {
          dock: 'left'
        }
      }
    },
    tools: {
      enabled: ['text', 'image', 'button'],
      disabled: ['video']
    },
    mergeTags: [
      {
        name: 'First Name',
        value: '{{first_name}}',
        sample: 'John'
      }
    ]
  };
</script>

<UnlayerEditor options={editorOptions} />
```

### With Export Modal

```svelte
<script>
  import { UnlayerEditor, ExportModal } from '@your-username/unlayer-svelte-wrapper';
  
  let editor;
  let showExportModal = false;
  let exportData = null;

  async function handleExport() {
    if (editor) {
      exportData = await editor.exportHtml();
      showExportModal = true;
    }
  }
</script>

<UnlayerEditor bind:this={editor} />

<button on:click={handleExport}>Export</button>

<ExportModal
  bind:show={showExportModal}
  {exportData}
  on:download={(e) => console.log('Downloaded:', e.detail)}
/>
```

### Loading Initial Design

```svelte
<script>
  import { UnlayerEditor, createSampleDesign } from '@your-username/unlayer-svelte-wrapper';
  
  const initialDesign = createSampleDesign();
</script>

<UnlayerEditor design={initialDesign} />
```

## TypeScript Support

The package includes comprehensive TypeScript definitions:

```typescript
import type { 
  UnlayerOptions, 
  UnlayerDesign, 
  ExportData,
  EditorLoadedEvent 
} from '@your-username/unlayer-svelte-wrapper';

const options: UnlayerOptions = {
  displayMode: 'email',
  projectId: 123
};

function handleLoaded(event: CustomEvent<EditorLoadedEvent>) {
  const editor = event.detail.editor;
  // editor is fully typed
}
```

## Styling

The component fills its parent container. Ensure the parent has defined dimensions:

```svelte
<div class="editor-container">
  <UnlayerEditor />
</div>

<style>
  .editor-container {
    width: 100%;
    height: 600px; /* or 100vh for full height */
  }
</style>
```

## Error Handling

The component includes built-in error handling with retry functionality:

```svelte
<UnlayerEditor
  on:loaded={handleLoaded}
  on:error={handleError}
/>
```

## Browser Support

- Modern browsers with ES2020+ support
- Svelte 4.0+ or 5.0+
- TypeScript 5.0+ (optional)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Muneeb Ahmad]

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.
