import chalk from 'chalk';
import ora, { Ora } from 'ora';
import process from 'process';

// ─── Silver palette ────────────────────────────────────────────────────────────
const silver = chalk.hex('#C0C0C0');
const dim = chalk.hex('#6B7280');
const bright = chalk.hex('#F3F4F6').bold;
const accent = chalk.hex('#E5E7EB').bold;
const success = chalk.hex('#86EFAC');
const warning = chalk.hex('#FDE68A');
const error = chalk.hex('#FCA5A5');
const muted = chalk.hex('#4B5563');

// ─── Terminal width ────────────────────────────────────────────────────────────
const cols = (): number => Math.min(process.stdout.columns || 90, 100);

// ─── 5×5 pixel font ───────────────────────────────────────────────────────────
// Each letter is a 5-row array of 5-bit masks (0=off, 1=on).
// Each rendered "pixel" is two block chars wide (██) so letters scale nicely.
const FONT: Record<string, number[][]> = {
    'S': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0],
    ],
    'T': [
        [1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
    ],
    'A': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
    ],
    'C': [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
    ],
    'K': [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
    ],
    'P': [
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
    ],
    'I': [
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
    ],
    'L': [
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
    ],
    'O': [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
    ],
    'N': [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
    ],
    ' ': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
};

// Render a word into 5 horizontal rows of pixel-art text.
function renderWord(word: string, color: chalk.Chalk, bg: chalk.Chalk): string[] {
    const rows: string[] = ['', '', '', '', ''];
    const chars = word.toUpperCase().split('');
    chars.forEach((ch, i) => {
        const pixels = FONT[ch] ?? FONT[' '];
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                rows[r] += pixels[r][c] ? color('██') : bg('  ');
            }
            if (i < chars.length - 1) rows[r] += '  '; // inter-letter gap
        }
    });
    return rows;
}

// ─── Banner ────────────────────────────────────────────────────────────────────
export function banner(): void {
    console.log();

    // Welcome badge (top)
    const badge = '  ✸  Welcome to StackPilot — AI Software Architect  ';
    const bLen = badge.length;
    console.log('  ' + muted('┌' + '─'.repeat(bLen) + '┐'));
    console.log('  ' + muted('│') + silver(badge) + muted('│'));
    console.log('  ' + muted('└' + '─'.repeat(bLen) + '┘'));
    console.log();

    // STACK in big pixel art
    const stackRows = renderWord('STACK', silver, chalk.hex('#1a1a1a'));
    stackRows.forEach(r => console.log('  ' + r));
    console.log();
    // PILOT in big pixel art
    const pilotRows = renderWord('PILOT', silver, chalk.hex('#1a1a1a'));
    pilotRows.forEach(r => console.log('  ' + r));
    console.log();
}

// ─── Primitives ────────────────────────────────────────────────────────────────
export const rule = (char = '─'): string => muted(char.repeat(cols()));

export const divider = (): void => console.log(rule());

export function header(title: string): void {
    const pad = Math.floor((cols() - title.length - 2) / 2);
    const left = '─'.repeat(Math.max(pad, 1));
    const right = '─'.repeat(Math.max(cols() - pad - title.length - 2, 1));
    console.log(muted(left) + ' ' + accent(title) + ' ' + muted(right));
}

export function section(title: string): void {
    console.log();
    console.log(silver('  ◆ ') + bright(title));
    console.log(muted('  ' + '─'.repeat(Math.min(cols() - 4, 50))));
}

export function kv(label: string, value: string | undefined, empty = 'None'): void {
    const lbl = dim(label.padEnd(12));
    const val = (value && value !== 'none')
        ? silver(value)
        : muted(empty);
    console.log(`    ${lbl}  ${val}`);
}

// ─── Logger ────────────────────────────────────────────────────────────────────
export const logger = {
    info: (msg: string) => console.log(`  ${dim('○')}  ${silver(msg)}`),
    success: (msg: string) => console.log(`  ${success('✓')}  ${silver(msg)}`),
    warn: (msg: string) => console.log(`  ${warning('!')}  ${dim(msg)}`),
    error: (msg: string) => console.log(`  ${error('✗')}  ${error(msg)}`),
    log: (msg: string) => console.log(`  ${msg}`),
    blank: () => console.log(),
};

// ─── Spinner ───────────────────────────────────────────────────────────────────
export const createSpinner = (text: string): Ora =>
    ora({
        text: dim(text),
        color: 'white',
        spinner: {
            interval: 80,
            frames: ['◌', '◎', '◉', '●', '◉', '◎'],
        },
        prefixText: '  ',
    });

// ─── Success box ───────────────────────────────────────────────────────────────
export function successBox(projectName: string): void {
    const msg = `  ✓  Project ready: ${projectName}  `;
    const w = msg.length;
    console.log();
    console.log('  ' + muted('┌' + '─'.repeat(w) + '┐'));
    console.log('  ' + muted('│') + success(msg) + muted('│'));
    console.log('  ' + muted('└' + '─'.repeat(w) + '┘'));
    console.log();
}

// ─── Next-steps block ──────────────────────────────────────────────────────────
export function nextSteps(projectName: string, pm: string): void {
    section('Next Steps');
    console.log();
    const run = pm === 'npm' ? 'npm run dev' : `${pm} dev`;
    console.log(`    ${dim('$')} ${silver(`cd ${projectName}`)}`);
    console.log(`    ${dim('$')} ${silver(run)}`);
    console.log();
}
