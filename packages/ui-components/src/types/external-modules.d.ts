declare module 'unist';
declare module 'hast';

declare module '*.svg' {
  const content: string;
  export default content;
}
