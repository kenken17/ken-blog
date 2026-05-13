import { describe, it, expect } from 'vitest';
import { giscusConfig } from '../giscus';

describe('giscusConfig', () => {
  it('exports all required fields', () => {
    expect(giscusConfig).toHaveProperty('repo');
    expect(giscusConfig).toHaveProperty('repoId');
    expect(giscusConfig).toHaveProperty('category');
    expect(giscusConfig).toHaveProperty('categoryId');
    expect(giscusConfig).toHaveProperty('mapping');
    expect(giscusConfig).toHaveProperty('theme');
    expect(giscusConfig).toHaveProperty('lang');
    expect(giscusConfig).toHaveProperty('reactionsEnabled');
    expect(giscusConfig).toHaveProperty('emitMetadata');
  });

  it('has theme set to light', () => {
    expect(giscusConfig.theme).toBe('light');
  });

  it('has mapping set to pathname', () => {
    expect(giscusConfig.mapping).toBe('pathname');
  });

  it('has lang set to en', () => {
    expect(giscusConfig.lang).toBe('en');
  });
});
