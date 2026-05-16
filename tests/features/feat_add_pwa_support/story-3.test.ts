import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const swPath = path.resolve('public/sw.js');

describe('Service Worker', () => {
  it('file exists', () => {
    expect(fs.existsSync(swPath)).toBe(true);
  });

  it('contains cache version constant', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("const CACHE_VERSION = 'ken-blog-v1'");
  });

  it('has install handler', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("self.addEventListener('install'");
    expect(content).toContain('caches.open');
  });

  it('has activate handler', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("self.addEventListener('activate'");
    expect(content).toContain('caches.keys');
    expect(content).toContain('caches.delete');
  });

  it('has fetch handler', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("self.addEventListener('fetch'");
  });

  it('references offline fallback page in install handler', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("'/offline.html'");
  });

  it('implements network-first for navigation requests', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("request.mode === 'navigate'");
    expect(content).toContain('fetch(request)');
  });

  it('implements cache-first for static assets', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain('caches.match(request)');
    expect(content).toMatch(/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|eot)/);
  });

  it('does not cache non-GET requests', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("request.method !== 'GET'");
  });

  it('offline fallback page exists', () => {
    const offlinePath = path.resolve('public/offline.html');
    expect(fs.existsSync(offlinePath)).toBe(true);
  });
});
