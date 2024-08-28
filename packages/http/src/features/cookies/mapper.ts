import cookie from "cookie";
import { DefaultHttpRequest, DefaultHttpResponse } from "../../impl";
import { AdditionalRequestMapper } from "../router";

export class CookieMapper implements AdditionalRequestMapper {
  map(request: DefaultHttpRequest, response: DefaultHttpResponse) {
    const cookieHeader = request.headers.get("Cookie") as string | null;
    if (!cookieHeader) return;

    const parsedCookies = cookie.parse(cookieHeader);
    request.cookies = new Map(Object.entries(parsedCookies));
  }
}
