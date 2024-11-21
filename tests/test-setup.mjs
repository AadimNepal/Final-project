import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setupTestData } from './test-helper.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function startServer() {
  const server = spawn('node', [join(__dirname, '..', 'app.mjs')]);

  return new Promise((resolve) => {
    server.stdout.on('data', async (data) => {
      console.log(`Server: ${data}`);
      if (data.toString().includes('MongoDB connected')) {
        await setupTestData();
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });
  });
}