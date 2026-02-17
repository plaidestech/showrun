import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RunContextFactory } from '../context.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import type { Browser, Page } from 'playwright';

describe('RunContextFactory', () => {
  const testDir = '/tmp/context-test';
  let mockPage: Page;
  let mockBrowser: Browser;
  let mockLogger: any;

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });

    mockPage = {
      screenshot: vi.fn().mockResolvedValue(undefined),
    } as unknown as Page;

    mockBrowser = {} as Browser;

    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should create a RunContext', () => {
    const artifactsDir = path.join(testDir, 'artifacts');
    
    const context = RunContextFactory.create(
      mockPage,
      mockBrowser,
      mockLogger,
      artifactsDir
    );

    expect(context).toBeDefined();
    expect(context.page).toBe(mockPage);
    expect(context.browser).toBe(mockBrowser);
    expect(context.logger).toBe(mockLogger);
    expect(context.artifacts).toBeDefined();
  });

  it('should create artifacts directory', async () => {
    const artifactsDir = path.join(testDir, 'new-artifacts');
    
    RunContextFactory.create(
      mockPage,
      mockBrowser,
      mockLogger,
      artifactsDir
    );

    const exists = await fs.access(artifactsDir).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  it('should provide saveScreenshot function', async () => {
    const artifactsDir = path.join(testDir, 'artifacts');
    
    const context = RunContextFactory.create(
      mockPage,
      mockBrowser,
      mockLogger,
      artifactsDir
    );

    const result = await context.artifacts.saveScreenshot('test');
    
    expect(result).toContain('test.png');
    expect(mockPage.screenshot).toHaveBeenCalledWith({
      path: expect.stringContaining('test.png'),
      fullPage: true,
    });
  });

  it('should provide saveHTML function', async () => {
    const artifactsDir = path.join(testDir, 'artifacts');
    
    const context = RunContextFactory.create(
      mockPage,
      mockBrowser,
      mockLogger,
      artifactsDir
    );

    const htmlContent = '<html><body>Test</body></html>';
    const result = await context.artifacts.saveHTML('test', htmlContent);
    
    expect(result).toContain('test.html');
    
    // Verify file was created
    const content = await fs.readFile(result, 'utf-8');
    expect(content).toBe(htmlContent);
  });

  it('should include network capture when provided', () => {
    const artifactsDir = path.join(testDir, 'artifacts');
    const mockNetworkCapture = {
      startCapture: vi.fn(),
      stopCapture: vi.fn(),
      getEntries: vi.fn(),
    };
    
    const context = RunContextFactory.create(
      mockPage,
      mockBrowser,
      mockLogger,
      artifactsDir,
      mockNetworkCapture as any
    );

    expect(context.networkCapture).toBe(mockNetworkCapture);
  });

  it('should work without network capture', () => {
    const artifactsDir = path.join(testDir, 'artifacts');
    
    const context = RunContextFactory.create(
      mockPage,
      mockBrowser,
      mockLogger,
      artifactsDir
    );

    expect(context.networkCapture).toBeUndefined();
  });
});
