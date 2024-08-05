import { createParamDecorator } from "./create-param-decorator";

export const Response = createParamDecorator((_, res) => res);
