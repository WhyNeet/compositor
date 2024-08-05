import { Qualifier } from "../../ioc";
import { APPLICATION_TOKEN } from "../tokens";

export const MetadataProcessor = () =>
  Qualifier(APPLICATION_TOKEN.METADATA_PROCESSOR);
