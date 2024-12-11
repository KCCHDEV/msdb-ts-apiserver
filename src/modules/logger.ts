import crypto from 'crypto';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  white: '\x1b[37m'
};

export class Logger {
  info(msg: string, data?: any) {
    console.log(
      `${colors.blue}ℹ ${colors.reset}${msg}` +
      (data ? `\n${colors.gray}${JSON.stringify(data, null, 2)}${colors.reset}` : '')
    );
  }

  success(msg: string, data?: any) {
    console.log(
      `${colors.green}✓ ${colors.reset}${msg}` +
      (data ? `\n${colors.gray}${JSON.stringify(data, null, 2)}${colors.reset}` : '')
    );
  }

  error(msg: string, error?: any) {
    console.log(
      `${colors.red}✗ ${colors.reset}${msg}` +
      (error ? `\n${colors.red}${JSON.stringify(error, null, 2)}${colors.reset}` : '')
    );
  }

  request(method: string, path: string, params: any, body?: any) {
    const timestamp = new Date().toISOString();
    const hash = crypto.createHash('md5')
      .update(JSON.stringify({ params, body }))
      .digest('hex')
      .substring(0, 6);

    console.log(
      `${colors.gray}[${timestamp}] ` +
      `${colors.yellow}#${hash} ` +
      `${colors.magenta}${method.padEnd(7)}` +
      `${colors.cyan}${path}${colors.reset}\n` +
      `${colors.gray}params: ${colors.white}${JSON.stringify(params)}${colors.reset}` +
      (body ? `\n${colors.gray}body: ${colors.white}${JSON.stringify(body)}${colors.reset}` : '')
    );
  }
}

export default new Logger(); 