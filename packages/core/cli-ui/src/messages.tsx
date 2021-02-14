import chalk from 'chalk';
import terminalLink from 'terminal-link';

export const PRIMARY_COLOR = `#24394e`;

export function displayMessage(message: string) {
  console.log(chalk.hex(PRIMARY_COLOR).bold(message));
}

export function displayWarning(message: string) {
  console.log(chalk.yellow.bold(message));
}

export function displayError(message: string) {
  console.log(chalk.red.bold(message));
}

export function displayLink(url: string) {
  if (terminalLink.isSupported) {
    const link = terminalLink(url, url);
    return chalk.blue.underline(link);
  }

  return url;
}
