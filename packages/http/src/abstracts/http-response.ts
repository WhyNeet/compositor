export abstract class HttpResponse {
  abstract headers: ResponseHeaders;
  abstract cookies: ResponseCookies;
  abstract contentType: ResponseContentType;
  abstract status: ResponseStatus;
  abstract body: ResponseBody;
}

export abstract class ResponseHeaders {
  abstract append(name: string, value: string | string[]): void;
  abstract get(name: string): string | string[];
  abstract getAll(): [string, string | string[]][];
}

export abstract class ResponseBody {
  abstract json<T extends Record<string, unknown>>(body: T): void;
  abstract text(body: string): void;
}

export abstract class ResponseStatus {
  abstract set(status: number): void;
  abstract get(): number;
}

export abstract class ResponseContentType {
  abstract set(type: string): string;
  abstract get(): string;
}

export abstract class ResponseCookies {
  abstract set(
    name: string,
    value: string,
    options?: Partial<CookieOptions>,
  ): void;

  abstract remove(name: string): void;

  abstract getAll(): [
    string,
    { value: string; options?: Partial<CookieOptions> },
  ][];
}

export interface CookieOptions {
  domain: string;
  encode: (value: string) => string;
  expires: Date;
  httpOnly: boolean;
  maxAge: number;
  path: string;
  partitioned: boolean;
  priority: Priority;
  secure: boolean;
  signed: boolean;
  sameSite: SameSite;
}

export enum SameSite {
  Lax = "lax",
  Strict = "strict",
  None = "none",
}

export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}
