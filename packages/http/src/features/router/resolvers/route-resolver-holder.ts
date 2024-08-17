import { Bean } from "@compositor/core";
import { HttpConfiguration } from "../../../decorators";
import { HttpConfigurationHolder } from "../../configuration";

@Bean()
export class RouteResolverHolder {
  constructor(
    @HttpConfiguration() private httpConfiguration: HttpConfigurationHolder,
  ) {}

  public resolver() {
    return;
  }
}
