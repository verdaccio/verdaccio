import { AccessType } from "@changesets/types";
import { Package } from "@manypkg/get-packages";
import { PreState } from "@changesets/types";
export default function publishPackages({ packages, access, otp, preState, tag }: {
    packages: Package[];
    access: AccessType;
    otp?: string;
    preState: PreState | undefined;
    tag?: string;
}): Promise<{
    name: string;
    newVersion: string;
    published: boolean;
}[]>;
