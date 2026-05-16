import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('dark mode CSS foundation', () => {
  const globalCssPath = path.resolve(process.cwd(), 'src/styles/global.css');
  const tailwindConfigPath = path.resolve(process.cwd(), 'tailwind.config.js');

  it('global.css defines :root variables for all 8 semantic colors', () => {
    const css = fs.readFileSync(globalCssPath, 'utf-8');
    const expectedVars = [
      '--color-background',
      '--color-background-surface',
      '--color-background-elevated',
      '--color-background-hover',
      '--color-foreground',
      '--color-foreground-secondary',
      '--color-foreground-muted',
      '--color-foreground-inverse',
    ];
    for (const variable of expectedVars) {
      expect(css).toContain(variable);
    }
  });

  it('global.css defines .dark overrides for all 8 semantic colors', () => {
    const css = fs.readFileSync(globalCssPath, 'utf-8');
    const darkSection = css.substring(css.indexOf('.dark'));
    const expectedVars = [
      '--color-background',
      '--color-background-surface',
      '--color-background-elevated',
      '--color-background-hover',
      '--color-foreground',
      '--color-foreground-secondary',
      '--color-foreground-muted',
      '--color-foreground-inverse',
    ];
    for (const variable of expectedVars) {
      expect(darkSection).toContain(variable);
    }
  });

  it('tailwind.config.js has darkMode class strategy', () => {
    const config = fs.readFileSync(tailwindConfigPath, 'utf-8');
    expect(config).toContain("darkMode: 'class'");
  });

  it('tailwind.config.js references CSS custom properties for background colors', () => {
    const config = fs.readFileSync(tailwindConfigPath, 'utf-8');
    expect(config).toContain("DEFAULT: 'var(--color-background)'");
    expect(config).toContain("surface: 'var(--color-background-surface)'");
    expect(config).toContain("elevated: 'var(--color-background-elevated)'");
    expect(config).toContain("hover: 'var(--color-background-hover)'");
  });

  it('tailwind.config.js references CSS custom properties for foreground colors', () => {
    const config = fs.readFileSync(tailwindConfigPath, 'utf-8');
    expect(config).toContain("DEFAULT: 'var(--color-foreground)'");
    expect(config).toContain("secondary: 'var(--color-foreground-secondary)'");
    expect(config).toContain("muted: 'var(--color-foreground-muted)'");
    expect(config).toContain("inverse: 'var(--color-foreground-inverse)'");
  });

  it('global.css uses CSS variables for html background and color', () => {
    const css = fs.readFileSync(globalCssPath, 'utf-8');
    expect(css).toContain('background-color: var(--color-background)');
    expect(css).toContain('color: var(--color-foreground)');
  });

  it('global.css has smooth transition on html', () => {
    const css = fs.readFileSync(globalCssPath, 'utf-8');
    expect(css).toContain('transition: background-color 0.2s ease, color 0.2s ease');
  });

  it('global.css defines dark prose overrides', () => {
    const css = fs.readFileSync(globalCssPath, 'utf-8');
    expect(css).toContain('.dark .prose-light');
  });
});
