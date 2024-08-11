import { Configuration, ConfigurationContext, Ctor } from "@compositor/core";
import {
  HttpMapper,
  HttpRequest,
  HttpResponse,
  PlatformConfiguration,
  PlatformMappersConfiguration,
} from "@compositor/http";
import { Request, Response } from "express";
import {
  ExpressRequest,
  ExpressResponse,
  RequestMapper,
  ResponseMapper,
  ServerBean,
} from "../server";

export class ExpressPlatformConfiguration extends PlatformConfiguration {
  private _mappers = new ExpressPlatformMappersConfiguration();

  serverClass(): Ctor {
    return ServerBean;
  }

  mappers(): PlatformMappersConfiguration {
    return this._mappers;
  }
}

export class ExpressPlatformMappersConfiguration
  implements PlatformMappersConfiguration
{
  request(): {
    // biome-ignore lint/suspicious/noExplicitAny:
    new (...args: any[]): HttpMapper<Request, ExpressRequest>;
  } {
    return RequestMapper;
  }

  response(): {
    // biome-ignore lint/suspicious/noExplicitAny:
    new (...args: any[]): HttpMapper<Response, ExpressResponse>;
  } {
    return ResponseMapper;
  }
}
