import { createParamDecorator } from "./create-param-decorator";

export const Request = createParamDecorator((req) => req);
