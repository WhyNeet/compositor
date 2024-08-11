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
  private _json: Record<string, unknown> | null = null;
  private _text: string | null = null;

  json<T extends Record<string, unknown>>(body: T): void {
    this._json = body;
    this._text = null;
  }

  text(body: string): void {
    this._text = body;
    this._json = null;
  }

  public getJson() {
    return this._json;
  }

  public getText() {
    return this._text;
  }
}

export class DefaultHttpResponseHeaders extends ResponseHeaders {
  private _headers: Map<string, string | string[]> = new Map();

  get(name: string): string | string[] {
    return this._headers.get(name);
  }

  append(name: string, value: string | string[]): void {
    this._headers.set(name, value);
  }

  getAll(): [string, string | string[]][] {
    return Array.from(this._headers.entries());
  }
}

export class DefaultHttpResponseCookies extends ResponseCookies {
  private _cookies: Map<
    string,
    { value: string; options?: Partial<CookieOptions> }
  > = new Map();

  set(name: string, value: string, options?: Partial<CookieOptions>): void {
    this._cookies.set(name, { value, options });
  }

  remove(name: string): void {
    this._cookies.delete(name);
  }

  getAll(): [string, { value: string; options?: Partial<CookieOptions> }][] {
    return Array.from(this._cookies.entries());
  }
}

export class DefaultHttpResponseContentType extends ResponseContentType {
  private _type = "application/octet-stream";

  set(type: string): string {
    this._type = type;
    return type;
  }

  get(): string {
    return this._type;
  }
}

export class DefaultHttpResponseStatus extends ResponseStatus {
  private _status = 200;

  get(): number {
    return this._status;
  }

  set(status: number): void {
    this._status = status;
  }
}
