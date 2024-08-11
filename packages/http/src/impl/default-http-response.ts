import {
  CookieOptions,
  HttpResponse,
  ResponseBody,
  ResponseContentType,
  ResponseCookies,
  ResponseHeaders,
  ResponseStatus,
} from "../abstracts";

export class DefaultHttpResponse extends HttpResponse {
  headers: DefaultHttpResponseHeaders;
  cookies: DefaultHttpResponseCookies;
  contentType: DefaultHttpResponseContentType;
  status: DefaultHttpResponseStatus;
  body: DefaultHttpResponseBody;
}

export class DefaultHttpResponseBody extends ResponseBody {
  json<T extends Record<string, unknown>>(body: T): void {
    throw new Error("Method not implemented.");
  }
  text(body: string): void {
    throw new Error("Method not implemented.");
  }
}

export class DefaultHttpResponseHeaders extends ResponseHeaders {
  getAll(): [string, string | string[]][] {
    throw new Error("Method not implemented.");
  }
  append(name: string, value: string | string[]): void {
    throw new Error("Method not implemented.");
  }
  get(name: string): string | string[] {
    throw new Error("Method not implemented.");
  }
}

export class DefaultHttpResponseCookies extends ResponseCookies {
  getAll(): [string, { value: string; options?: Partial<CookieOptions> }][] {
    throw new Error("Method not implemented.");
  }
  set(name: string, value: string, options?: Partial<CookieOptions>): void {
    throw new Error("Method not implemented.");
  }
  remove(name: string): void {
    throw new Error("Method not implemented.");
  }
}

export class DefaultHttpResponseContentType extends ResponseContentType {
  set(type: string): string {
    throw new Error("Method not implemented.");
  }
  get(): string {
    throw new Error("Method not implemented.");
  }
}

export class DefaultHttpResponseStatus extends ResponseStatus {
  set(status: number): void {
    throw new Error("Method not implemented.");
  }
  get(): number {
    throw new Error("Method not implemented.");
  }
}
