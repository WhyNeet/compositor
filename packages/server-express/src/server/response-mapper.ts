import { Bean } from "@compositor/core";
import { HttpMapper } from "@compositor/http";
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
export class ResponseMapper implements HttpMapper<Response, ExpressResponse> {
  public map(response: Response): ExpressResponse {
    const expressResponse = new ExpressResponse(response);

    expressResponse.body = new ExpressResponseBody();
    expressResponse.contentType = new ExpressResponseContentType();
    expressResponse.cookies = new ExpressResponseCookies();
    expressResponse.headers = new ExpressResponseHeaders();
    expressResponse.status = new ExpressResponseStatus();

    return expressResponse;
  }

  public mapback(expressResponse: ExpressResponse): Response {
    const response = expressResponse.inner();

    for (const [name, { value, options }] of expressResponse.cookies.getAll())
      response.cookie(name, value, options);

    for (const [name, value] of expressResponse.headers.getAll())
      response.header(name, value);

    response.contentType(expressResponse.contentType.get());
    response.status(expressResponse.status.get());

    if (expressResponse.body.getJson())
      response.json(expressResponse.body.getJson());
    else response.send(expressResponse.body.getText());

    return response;
  }
}
