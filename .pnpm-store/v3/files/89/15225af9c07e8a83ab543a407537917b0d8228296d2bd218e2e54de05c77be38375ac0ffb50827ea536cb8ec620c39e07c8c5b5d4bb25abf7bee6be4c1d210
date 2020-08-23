import { Packages, Package } from "@manypkg/get-packages";
export default function getDependencyGraph(packages: Packages): {
    graph: Map<string, {
        pkg: Package;
        dependencies: Array<string>;
    }>;
    valid: boolean;
};
