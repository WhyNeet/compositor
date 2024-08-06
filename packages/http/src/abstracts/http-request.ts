import { HttpMethod, Protocol } from "../types";

export abstract class HttpRequest {
  // biome-ignore lint/complexity/noBannedTypes: string or any json object
  abstract body: string | Object;
  abstract cookies: Map<string | symbol, unknown>;
  abstract headers: Map<string | symbol, unknown>;
  abstract fresh: boolean;
  abstract hostname: string;
  abstract ip: string;
  abstract ips: string[];
  abstract method: HttpMethod;
  abstract originalUrl: string;
  abstract params: Map<string | symbol, unknown>;
  abstract path: string;
  abstract protocol: Protocol;
  abstract signedCookies: Map<string | symbol, unknown>;
  abstract subdomains: string[];
  abstract xhr: boolean;

  abstract accepts(type: string | string[]): string | undefined;
  abstract acceptsCharsets(charsets: string[]): string | undefined;
  abstract acceptsEncodings(encodings: string[]): string | undefined;
  abstract acceptsLanguages(languages: string[]): string | undefined;
}
