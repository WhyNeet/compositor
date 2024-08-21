import { Apply } from "../../application";
import { ClassDecorator, Decorator } from "../../shared";
import { METADATA_KEY } from "../constants";
import { Ctor } from "../types";

@Decorator()
export class BeanDecorator extends ClassDecorator {
  apply<T extends Ctor>(target: T): void {
    const dependencies: Ctor[] =
      Reflect.getOwnMetadata(METADATA_KEY.DESIGN_PARAM_TYPES, target) ?? [];
    Reflect.defineMetadata(
      METADATA_KEY.IOC_FACTORY_ARGS,
      dependencies.map((dependency) => dependency?.name),
      target,
    );

    Reflect.defineMetadata(METADATA_KEY.IOC_DEFAULT_TOKEN, target.name, target);
  }
}

export const Bean = () => Apply(BeanDecorator);
Bean.decorator = BeanDecorator;
