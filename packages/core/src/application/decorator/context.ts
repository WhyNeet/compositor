import { Qualifier } from "../../ioc";
import { APPLICATION_TOKEN } from "../tokens";

export const Context = () => Qualifier(APPLICATION_TOKEN.APPLICATION_CONTEXT);
