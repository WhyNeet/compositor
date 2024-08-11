import {
  CookieOptions,
  DefaultHttpResponse,
  DefaultHttpResponseBody,
  DefaultHttpResponseContentType,
  DefaultHttpResponseCookies,
  DefaultHttpResponseHeaders,
  DefaultHttpResponseStatus,
} from "@compositor/http";
import { Response } from "express";

export class ExpressResponse extends DefaultHttpResponse {
  private _inner: Response;

  constructor(response: Response) {
    super();
    this._inner = response;
  }

  public inner() {
    return this._inner;
  }

  body: ExpressResponseBody;
  contentType: ExpressResponseContentType;
  cookies: ExpressResponseCookies;
  headers: ExpressResponseHeaders;
  status: DefaultHttpResponseStatus;
}

export class ExpressResponseBody extends DefaultHttpResponseBody {
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

export class ExpressResponseContentType extends DefaultHttpResponseContentType {
  private _type = "application/octet-stream";

  set(type: string): string {
    this._type = type;
    return type;
  }

  get(): string {
    return this._type;
  }
}

export class ExpressResponseCookies extends DefaultHttpResponseCookies {
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

export class ExpressResponseHeaders extends DefaultHttpResponseHeaders {
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

export class ExpressResponseStatus extends DefaultHttpResponseStatus {
  private _status = 200;

  get(): number {
    return this._status;
  }

  set(status: number): void {
    this._status = status;
  }
}
