import { HttpRequest, RequestBody } from "../abstracts";
import { HttpMethod, Protocol } from "../types";

export class DefaultHttpRequest extends HttpRequest {
  body: DefaultRequestBody;
  cookies: Map<string | symbol, unknown>;
  headers: Map<string | symbol, unknown>;
  fresh: boolean;
  hostname: string;
  ip: string;
  ips: string[];
  method: HttpMethod;
  originalUrl: string;
  params: Map<string | symbol, unknown>;
  path: string;
  protocol: Protocol;
  signedCookies: Map<string | symbol, unknown>;
  subdomains: string[];
  xhr: boolean;

  accepts(type: string | string[]): string | null {
    throw new Error("Method not implemented.");
  }
  acceptsCharsets(charsets: string[]): string | null {
    throw new Error("Method not implemented.");
  }
  acceptsEncodings(encodings: string[]): string | null {
    throw new Error("Method not implemented.");
  }
  acceptsLanguages(languages: string[]): string | null {
    throw new Error("Method not implemented.");
  }
}

export class DefaultRequestBody extends RequestBody {
  text(): string | null {
    throw new Error("Method not implemented.");
  }
  json<T extends Record<string, unknown>>(): T | null {
    throw new Error("Method not implemented.");
  }
}
