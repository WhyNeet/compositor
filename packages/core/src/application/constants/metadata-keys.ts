export const APPLICATION_CONTROLLER = "application:controller";
export const CONTROLLER_HANDLER = "application:controller:handler";
export const CONTROLLER_HANDLERS = "application:controller:handlers";

export const HANDLER_PROVIDE = "application:controller:handler:provide";
export const HANDLER_MIDDLEWARE = (key: string | symbol) =>
  `application:controller:handler:${String(key)}`;
