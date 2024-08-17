// biome-ignore lint/suspicious/noExplicitAny: suppress type errors
export type HttpHandler = (request: any, response: any) => void;
