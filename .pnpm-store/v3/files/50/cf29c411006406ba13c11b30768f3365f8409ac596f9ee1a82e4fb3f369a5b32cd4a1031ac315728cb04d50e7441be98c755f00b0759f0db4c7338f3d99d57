import chalk from 'chalk';
export interface FormattableProblem {
    level: 0 | 1 | 2;
    name: string;
    message: string;
}
export interface FormattableResult {
    errors?: FormattableProblem[];
    warnings?: FormattableProblem[];
}
export interface WithInput {
    input?: string;
}
export interface FormattableReport {
    results?: (FormattableResult & WithInput)[];
}
export declare type ChalkColor = keyof typeof chalk;
export interface FormatOptions {
    color?: boolean;
    signs?: readonly [string, string, string];
    colors?: readonly [ChalkColor, ChalkColor, ChalkColor];
    verbose?: boolean;
    helpUrl?: string;
}
export declare function format(report?: FormattableReport, options?: FormatOptions): string;
export declare function formatResult(result?: FormattableResult, options?: FormatOptions): string[];
export default format;
//# sourceMappingURL=format.d.ts.map