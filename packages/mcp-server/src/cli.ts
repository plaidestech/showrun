#!/usr/bin/env node

import { resolve } from 'path';
import { discoverPacks } from './packDiscovery.js';
import { createMCPServer } from './server.js';
import { createMCPServerOverHTTP } from './httpServer.js';

interface CliOptions {
  packs: string[];
  headful: boolean;
  concurrency: number;
  baseRunDir: string;
  http: boolean;
  port: number;
  host: string;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  let packsStr: string | null = null;
  // Default to headful if DISPLAY is available, otherwise headless
  let headful = !!process.env.DISPLAY;
  let concurrency = 1;
  let baseRunDir = './runs';
  let http = false;
  let port = 3000;
  let host = '127.0.0.1';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--packs' && i + 1 < args.length) {
      packsStr = args[i + 1];
      i++;
    } else if (args[i] === '--headful') {
      headful = true;
    } else if (args[i] === '--headless') {
      headful = false;
    } else if (args[i] === '--concurrency' && i + 1 < args.length) {
      concurrency = parseInt(args[i + 1], 10);
      if (isNaN(concurrency) || concurrency < 1) {
        console.error('Error: --concurrency must be a positive integer');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--baseRunDir' && i + 1 < args.length) {
      baseRunDir = args[i + 1];
      i++;
    } else if (args[i] === '--http') {
      http = true;
    } else if (args[i] === '--port' && i + 1 < args.length) {
      port = parseInt(args[i + 1], 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        console.error('Error: --port must be a valid port number (1-65535)');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--host' && i + 1 < args.length) {
      host = args[i + 1];
      i++;
    }
  }

  if (!packsStr) {
    console.error('Error: --packs <dir1,dir2,...> is required');
    console.error('Example: tp mcp --packs ./taskpacks,./other-packs');
    console.error('');
    console.error('Options:');
    console.error('  --packs <dirs>      Comma-separated list of pack directories (required)');
    console.error('  --headful           Run browser in headful mode');
    console.error('  --headless          Run browser in headless mode');
    console.error('  --concurrency <n>   Max concurrent executions (default: 1)');
    console.error('  --baseRunDir <dir>  Directory for run outputs (default: ./runs)');
    console.error('  --http              Use HTTP transport instead of stdio');
    console.error('  --port <port>       HTTP server port (default: 3000, requires --http)');
    console.error('  --host <host>       HTTP server host (default: 127.0.0.1, requires --http)');
    process.exit(1);
  }

  const packs = packsStr.split(',').map((dir) => dir.trim()).filter(Boolean);

  if (packs.length === 0) {
    console.error('Error: At least one pack directory is required');
    process.exit(1);
  }

  return {
    packs: packs.map((dir) => resolve(dir)),
    headful,
    concurrency,
    baseRunDir: resolve(baseRunDir),
    http,
    port,
    host,
  };
}

async function main() {
  try {
    const options = parseArgs();

    console.error(`[MCP Server] Discovering task packs from: ${options.packs.join(', ')}`);

    // Discover packs
    const discoveredPacks = await discoverPacks({
      directories: options.packs,
      nested: true,
    });

    if (discoveredPacks.length === 0) {
      console.error('Error: No valid task packs found in the specified directories');
      process.exit(1);
    }

    console.error(`[MCP Server] Discovered ${discoveredPacks.length} task pack(s):`);
    for (const { pack, toolName } of discoveredPacks) {
      console.error(`[MCP Server]   - ${toolName} (${pack.metadata.id} v${pack.metadata.version})`);
    }

    // Warn if headful requested but no DISPLAY
    if (options.headful && !process.env.DISPLAY) {
      console.error(
        '[MCP Server] Warning: Headful mode requested but DISPLAY not set. ' +
        'Will fall back to headless. Set DISPLAY or use xvfb-run to enable headful mode.'
      );
    }

    if (options.http) {
      // Create and start HTTP MCP server
      const handle = await createMCPServerOverHTTP({
        packs: discoveredPacks,
        baseRunDir: options.baseRunDir,
        concurrency: options.concurrency,
        headful: options.headful,
        port: options.port,
        host: options.host,
      });

      console.error(`[MCP Server] HTTP server listening at ${handle.url}`);

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.error('[MCP Server] Shutting down...');
        await handle.close();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        console.error('[MCP Server] Shutting down...');
        await handle.close();
        process.exit(0);
      });
    } else {
      // Create and start stdio MCP server
      await createMCPServer({
        packs: discoveredPacks,
        baseRunDir: options.baseRunDir,
        concurrency: options.concurrency,
        headful: options.headful,
      });
    }

    // Server runs indefinitely
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[MCP Server] Fatal error: ${errorMessage}`);
    process.exit(1);
  }
}

main();
