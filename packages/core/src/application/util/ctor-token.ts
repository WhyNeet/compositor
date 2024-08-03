import { Ctor, METADATA_KEY } from "../../ioc";

export const getCtorToken = <T extends Ctor>(ctor: T) =>
  Reflect.getOwnMetadata(METADATA_KEY.DESIGN_TYPE, ctor);
