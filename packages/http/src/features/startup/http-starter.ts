import {
  ApplicationContext,
  Bean,
  ContainerEvent,
  Context,
} from "@compositor/core";
import { HttpServer } from "../../abstracts";
import { HttpConfiguration, HttpRouter, Server } from "../../decorators";
import { HttpConfigurationHolder } from "../configuration";
import { Router } from "../router";

@Bean()
export class HttpStarter {
  constructor(
    @Server() private httpServer: HttpServer,
    @HttpRouter() private httpRouter: Router,
    @Context() private context: ApplicationContext,
    @HttpConfiguration() private httpConfiguration: HttpConfigurationHolder,
  ) {
    this.context
      .containerEvents()
      .subscribe(ContainerEvent.CONTAINER_BOOTSTRAPPED, this.start.bind(this));
  }

  private start() {
    this.httpServer.configure(
      this.httpConfiguration.server ?? {
        baseUrl: "/",
        hostname: "127.0.0.1",
        launchCallback: () =>
          console.log("express server running on: http://127.0.0.1:8080"),
        port: 8080,
      },
    );

    this.httpServer.mount(this.httpRouter.handler.bind(this.httpRouter));

    this.httpServer.launch();
  }
}
