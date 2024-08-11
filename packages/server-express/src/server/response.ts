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

export class ExpressResponseBody extends DefaultHttpResponseBody {}

export class ExpressResponseContentType extends DefaultHttpResponseContentType {}

export class ExpressResponseCookies extends DefaultHttpResponseCookies {}

export class ExpressResponseHeaders extends DefaultHttpResponseHeaders {}

export class ExpressResponseStatus extends DefaultHttpResponseStatus {}
