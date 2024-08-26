import { Bean, Ctor } from "../../ioc";
import { Apply, ClassDecorator, Decorator } from "../../shared";
import { METADATA_KEY } from "../constants";
import { HandlerPath } from "../features";

@Decorator()
export class ControllerDecorator extends ClassDecorator<[HandlerPath]> {
  apply<T extends Ctor>(target: T): void {
    Bean()(target);
    Reflect.defineMetadata(
      METADATA_KEY.APPLICATION_CONTROLLER,
      this.args()[0],
      target,
    );
  }
}

export const Controller = (...path: HandlerPath) =>
  Apply(ControllerDecorator, path);
Controller.decorator = ControllerDecorator;
