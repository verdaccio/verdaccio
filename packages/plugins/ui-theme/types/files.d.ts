declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const value: string;
  export = value;
}
