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
  private _text: string | null = null;
  private _json: Record<string, unknown> | null = null;

  constructor(body: unknown) {
    super();
    if (typeof body === "string") this._text = body;
    else this._json = body as typeof this._json;
  }

  text(): string | null {
    return this._text;
  }

  json<T extends Record<string, unknown>>(): T | null {
    return this._json as T;
  }
}
