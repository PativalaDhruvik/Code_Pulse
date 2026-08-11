import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const isWin = process.platform === 'win32';
const venvPython = isWin
  ? path.join('backend', '.venv', 'Scripts', 'python.exe')
  : path.join('backend', '.venv', 'bin', 'python');

let pythonCmd = fs.existsSync(venvPython) ? venvPython : (isWin ? 'python' : 'python3');

const child = spawn(pythonCmd, ['backend/manage.py', 'runserver', '0.0.0.0:8000'], {
  stdio: 'inherit'
});

child.on('exit', (code) => process.exit(code || 0));
