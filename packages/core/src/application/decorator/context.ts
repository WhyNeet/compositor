import { Qualifier } from "../../ioc/decorator";
import { APPLICATION_TOKEN } from "../tokens";

export const Context = () => Qualifier(APPLICATION_TOKEN.APPLICATION_CONTEXT);
