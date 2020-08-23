declare function whichpm (pkgPath: string): Promise<whichpm.Result>

declare namespace whichpm {
  type Result = NPM | YARN | PNPM | Other

  interface NPM {
    readonly name: 'npm'
  }

  interface YARN {
    readonly name: 'yarn'
  }

  interface PNPM {
    readonly name: 'pnpm'
    readonly version: string
  }

  interface Other {
    readonly name: string
    readonly version?: string
  }
}

export = whichpm
