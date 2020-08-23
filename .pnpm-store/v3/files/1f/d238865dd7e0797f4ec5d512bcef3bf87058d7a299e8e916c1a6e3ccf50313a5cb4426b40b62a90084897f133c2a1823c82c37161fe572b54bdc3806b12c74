import { Lib } from './lib';
declare type DebugLevel = boolean | ('typescript-eslint' | 'eslint' | 'typescript')[];
declare type EcmaVersion = 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020;
declare type SourceType = 'script' | 'module';
interface ParserOptions {
    ecmaFeatures?: {
        globalReturn?: boolean;
        jsx?: boolean;
    };
    ecmaVersion?: EcmaVersion;
    lib?: Lib[];
    comment?: boolean;
    debugLevel?: DebugLevel;
    errorOnTypeScriptSyntacticAndSemanticIssues?: boolean;
    errorOnUnknownASTType?: boolean;
    extraFileExtensions?: string[];
    filePath?: string;
    loc?: boolean;
    project?: string | string[];
    projectFolderIgnoreList?: (string | RegExp)[];
    range?: boolean;
    sourceType?: SourceType;
    tokens?: boolean;
    tsconfigRootDir?: string;
    useJSXTextNode?: boolean;
    warnOnUnsupportedTypeScriptVersion?: boolean;
}
export { DebugLevel, EcmaVersion, ParserOptions, SourceType };
//# sourceMappingURL=parser-options.d.ts.map