function getRouterPackageName(packageName: string, scope?: string): string {
  if (scope) {
    return `@${scope}/${packageName}`;
  }

  return packageName;
}

export default getRouterPackageName;
