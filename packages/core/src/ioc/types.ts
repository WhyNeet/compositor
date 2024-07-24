export interface Ctor {
  // biome-ignore lint/suspicious/noExplicitAny: suppress ts error
  new (...args: any[]): unknown;
}
