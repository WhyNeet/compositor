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
  append(name: string | symbol, value: string | string[]): void {
    throw new Error("Method not implemented.");
  }
  get(name: string | symbol): string | string[] {
    throw new Error("Method not implemented.");
  }
}

export class DefaultHttpResponseCookies extends ResponseCookies {
  set(name: string, value: string, options?: Partial<CookieOptions>): void {
    throw new Error("Method not implemented.");
  }
  remove(name: string, options?: Partial<CookieOptions>): void {
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
