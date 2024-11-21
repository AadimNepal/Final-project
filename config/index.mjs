import nconf from 'nconf';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setup nconf
nconf
  // Command-line arguments
  .argv()
  // Environment variables
  .env()
  // Config file
  .file('config', { file: path.join(__dirname, `${process.env.NODE_ENV || 'development'}.json`) })
  // Defaults
  .defaults({
    PORT: process.env.PORT || 22229,
    NODE_ENV: 'development',
    SESSION_SECRET: 'your-secret-key',
    MONGODB: {
      DSN: process.env.DSN || 'mongodb+srv://at5282:ashok@cluster0.lqvu5.mongodb.net/finalproject?retryWrites=true&w=majority&appName=Cluster0'
    },
    EMAIL: {
      SERVICE: 'gmail',
      USER: process.env.EMAIL || 'an3854@nyu.edu',
      PASS: process.env.EMAIL_PASSWORD || 'qqrg aegl ipad uipi'
    }
  });

export default nconf;