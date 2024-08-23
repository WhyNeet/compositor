import { Ctor } from "../../ioc";
import { Apply, ClassDecorator } from "../../shared";
import { METADATA_KEY } from "../constants";

export class AdviceIgnoreDecorator implements ClassDecorator {
  apply<T extends Ctor>(target: T): void {
    Reflect.defineMetadata(
      METADATA_KEY.APPLICATION_ADVICE_IGNORE,
      true,
      target,
    );
  }
}

export const AdviceIgnore = () => Apply(AdviceIgnoreDecorator);
AdviceIgnore.decorator = AdviceIgnoreDecorator;

export const isIgnored = (ctor: Ctor) =>
  Reflect.getOwnMetadata(METADATA_KEY.APPLICATION_ADVICE_IGNORE, ctor);
