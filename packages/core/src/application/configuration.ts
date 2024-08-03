import { ConfigurationContext } from "./context";

export abstract class Configuration {
  abstract configure(cx: ConfigurationContext): void;
}
