import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import UnlayerEditor from '../src/lib/UnlayerEditor.svelte';

describe('UnlayerEditor', () => {
  it('renders editor container', () => {
    const { container } = render(UnlayerEditor);
    expect(container.querySelector('div')).toBeTruthy();
  });
});
