import { HttpMethod, Protocol } from "../types";

export abstract class HttpRequest {
  abstract body: RequestBody;
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

  abstract accepts(type: string | string[]): string | null;
  abstract acceptsCharsets(charsets: string[]): string | null;
  abstract acceptsEncodings(encodings: string[]): string | null;
  abstract acceptsLanguages(languages: string[]): string | null;
}

export abstract class RequestBody {
  abstract text(): string | null;
  abstract json<T extends Record<string, unknown>>(): T | null;
}
