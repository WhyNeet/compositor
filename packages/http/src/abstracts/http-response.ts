export abstract class HttpResponse {
  abstract headers: Map<string | symbol, unknown>;
  abstract cookies: Map<string | symbol, unknown>;
  abstract setType: (type: string) => string;
  abstract setStatus: (status: number) => void;
}

export abstract class ResponseHeaders {
  abstract append(name: string | symbol, value: string | string[]): void;
  abstract get(name: string | symbol): void;
}

export abstract class ResponseCookies {
  abstract set(
    name: string,
    value: string,
    options?: Partial<CookieOptions>,
  ): void;

  abstract remove(name: string, options?: Partial<CookieOptions>): void;
}

export interface CookieOptions {
  domain: string;
  encode: (value: string) => string;
  expires: Date;
  httpOnly: boolean;
  maxAge: number;
  path: string;
  partitioned: boolean;
  priority: string;
  secure: boolean;
  signed: boolean;
  sameSite: boolean | string;
}
