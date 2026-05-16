import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('public/manifest.json');

describe('Web App Manifest', () => {
  it('parses as valid JSON', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    expect(manifest).toBeDefined();
  });

  it('contains all required fields', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.start_url).toBeDefined();
    expect(manifest.display).toBeDefined();
    expect(manifest.theme_color).toBeDefined();
    expect(manifest.background_color).toBeDefined();
    expect(manifest.icons).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBe(true);
  });

  it('has display set to standalone', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    expect(manifest.display).toBe('standalone');
  });

  it('has correct name and short_name', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    expect(manifest.name).toBe("Ken's Blog");
    expect(manifest.short_name).toBe("Ken's Blog");
  });

  it('has correct start_url', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    expect(manifest.start_url).toBe('/');
  });

  it('has theme_color and background_color matching site values', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    expect(manifest.theme_color).toBe('#FAFAFA');
    expect(manifest.background_color).toBe('#FAFAFA');
  });
});
