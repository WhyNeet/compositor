import { Bean } from "@compositor/core";
import { Response } from "express";
import {
  ExpressResponse,
  ExpressResponseBody,
  ExpressResponseContentType,
  ExpressResponseCookies,
  ExpressResponseHeaders,
  ExpressResponseStatus,
} from "./response";

@Bean()
export class ResponseMapper {
  public map(response: Response): ExpressResponse {
    const expressResponse = new ExpressResponse();

    expressResponse.body = new ExpressResponseBody();
    expressResponse.contentType = new ExpressResponseContentType();
    expressResponse.cookies = new ExpressResponseCookies();
    expressResponse.headers = new ExpressResponseHeaders();
    expressResponse.status = new ExpressResponseStatus();

    return expressResponse;
  }
}
