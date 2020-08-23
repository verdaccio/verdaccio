import { TwoFactorState } from "../../utils/types";
export declare function getTokenIsRequired(): Promise<boolean>;
export declare function getPackageInfo(pkgName: string): Promise<any>;
export declare function infoAllow404(pkgName: string): Promise<{
    published: boolean;
    pkgInfo: any;
}>;
export declare let getOtpCode: (twoFactorState: TwoFactorState) => Promise<string>;
export declare function publish(pkgName: string, opts: {
    cwd: string;
    access?: string;
    tag: string;
}, twoFactorState: TwoFactorState): Promise<{
    published: boolean;
}>;
