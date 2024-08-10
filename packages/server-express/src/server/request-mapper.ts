import { Bean } from "@compositor/core";
import { HttpMethod, Protocol } from "@compositor/http";
import { Request } from "express";
import { ExpressRequest, ExpressRequestBody } from "./request";

@Bean()
export class RequestMapper {
  public map(request: Request): ExpressRequest {
    const expressRequest = new ExpressRequest(request);

    expressRequest.body = new ExpressRequestBody(request.body);
    expressRequest.cookies = request.cookies
      ? new Map(Object.entries(request.cookies))
      : new Map();
    expressRequest.fresh = request.fresh;
    expressRequest.headers = request.headers
      ? new Map(Object.entries(request.headers))
      : new Map();
    expressRequest.hostname = request.hostname;
    expressRequest.ip = request.ip;
    expressRequest.ips = request.ips;
    expressRequest.method = request.method as HttpMethod;
    expressRequest.originalUrl = request.originalUrl;
    expressRequest.params = request.params
      ? new Map(Object.entries(request.params))
      : new Map();
    expressRequest.path = request.path;
    expressRequest.protocol = request.protocol as Protocol;
    expressRequest.signedCookies = request.cookies
      ? new Map(Object.entries(request.signedCookies))
      : new Map();
    expressRequest.subdomains = request.subdomains;
    expressRequest.xhr = request.xhr;

    return expressRequest;
  }
}
