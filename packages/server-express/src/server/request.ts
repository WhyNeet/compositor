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

export class ExpressRequestBody extends DefaultRequestBody {}
