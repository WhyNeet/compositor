import { Qualifier } from "../../ioc/decorator";
import { APPLICATION_TOKEN } from "../constants";

export const Context = () => Qualifier(APPLICATION_TOKEN.APPLICATION_CONTEXT);
