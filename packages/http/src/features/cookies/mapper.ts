import cookie from "cookie";
import { DefaultHttpRequest, DefaultHttpResponse } from "../../impl";

export function cookiesMapper(
  request: DefaultHttpRequest,
  response: DefaultHttpResponse,
) {
  const cookieHeader = request.headers.get("Cookie") as string | null;
  if (!cookieHeader) return;

  const parsedCookies = cookie.parse(cookieHeader);
  request.cookies = new Map(Object.entries(parsedCookies));
}
