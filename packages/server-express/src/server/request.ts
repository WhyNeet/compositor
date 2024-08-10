import { DefaultHttpRequest, DefaultRequestBody } from "@compositor/http";
import { Request } from "express";

export class ExpressRequest extends DefaultHttpRequest {
  private _inner: Request;

  constructor(request: Request) {
    super();
    this._inner = request;
  }

  accepts(type: string | string[]): string | null {
    // biome-ignore lint/suspicious/noExplicitAny: suppress type error
    const res = this._inner.accepts(type as any);

    return typeof res === "string" ? res : null;
  }

  acceptsCharsets(charsets: string[]): string | null {
    // biome-ignore lint/suspicious/noExplicitAny: suppress type error
    const res = this._inner.acceptsCharsets(charsets as any);

    return typeof res === "string" ? res : null;
  }

  acceptsLanguages(languages: string[]): string | null {
    // biome-ignore lint/suspicious/noExplicitAny: suppress type error
    const res = this._inner.acceptsLanguages(languages as any);

    return typeof res === "string" ? res : null;
  }

  acceptsEncodings(encodings: string[]): string | null {
    // biome-ignore lint/suspicious/noExplicitAny: suppress type error
    const res = this._inner.acceptsEncodings(encodings as any);

    return typeof res === "string" ? res : null;
  }
}

export class ExpressRequestBody extends DefaultRequestBody {
  private _text: string | null;
  private _json: Record<string, unknown> | null;

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
