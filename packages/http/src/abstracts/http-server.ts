export abstract class HttpServer {
  abstract configure(configuration: HttpServerConfiguration): void;
  abstract mount(
    handler: (request: GenericHttpRequest, response: unknown) => void,
  ): void;
  abstract launch(): void;
}

export abstract class GenericHttpRequest {
  path: string;
  method: string;
}

export interface HttpServerConfiguration {
  hostname: string;
  port: number;
  baseUrl: string;
  launchCallback: () => void;
  middlewares: ((req: unknown, res: unknown, next: unknown) => void)[];
}
