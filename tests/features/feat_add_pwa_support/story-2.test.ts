import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('public/manifest.json');
const iconsDir = path.resolve('public/icons');

describe('PWA Icons', () => {
  it('icon files exist at expected paths', () => {
    expect(fs.existsSync(path.join(iconsDir, 'icon-192x192.png'))).toBe(true);
    expect(fs.existsSync(path.join(iconsDir, 'icon-512x512.png'))).toBe(true);
    expect(fs.existsSync(path.join(iconsDir, 'maskable-icon-512x512.png'))).toBe(true);
    expect(fs.existsSync(path.join(iconsDir, 'apple-touch-icon.png'))).toBe(true);
  });

  it('manifest icons array references all required icons', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    const icon192 = manifest.icons.find((icon: any) => icon.sizes === '192x192');
    const icon512 = manifest.icons.find((icon: any) => icon.sizes === '512x512' && icon.purpose === 'any');
    const maskable = manifest.icons.find((icon: any) => icon.purpose === 'maskable');

    expect(icon192).toBeDefined();
    expect(icon192.src).toBe('/icons/icon-192x192.png');
    expect(icon192.type).toBe('image/png');
    expect(icon192.purpose).toBe('any');

    expect(icon512).toBeDefined();
    expect(icon512.src).toBe('/icons/icon-512x512.png');
    expect(icon512.type).toBe('image/png');

    expect(maskable).toBeDefined();
    expect(maskable.src).toBe('/icons/maskable-icon-512x512.png');
    expect(maskable.type).toBe('image/png');
    expect(maskable.sizes).toBe('512x512');
  });
});
