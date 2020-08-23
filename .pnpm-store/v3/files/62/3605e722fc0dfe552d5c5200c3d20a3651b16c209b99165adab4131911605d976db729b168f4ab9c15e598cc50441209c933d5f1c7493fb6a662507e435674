import { TSESTreeOptions, ParserServices } from './parser-options';
import { TSESTree } from './ts-estree';
interface EmptyObject {
}
declare type AST<T extends TSESTreeOptions> = TSESTree.Program & (T['tokens'] extends true ? {
    tokens: TSESTree.Token[];
} : EmptyObject) & (T['comment'] extends true ? {
    comments: TSESTree.Comment[];
} : EmptyObject);
interface ParseAndGenerateServicesResult<T extends TSESTreeOptions> {
    ast: AST<T>;
    services: ParserServices;
}
declare function parse<T extends TSESTreeOptions = TSESTreeOptions>(code: string, options?: T): AST<T>;
declare function parseAndGenerateServices<T extends TSESTreeOptions = TSESTreeOptions>(code: string, options: T): ParseAndGenerateServicesResult<T>;
export { AST, parse, parseAndGenerateServices, ParseAndGenerateServicesResult };
//# sourceMappingURL=parser.d.ts.map