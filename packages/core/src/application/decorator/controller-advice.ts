import { Ctor } from "../../ioc";
import { Apply, ClassDecorator, Decorator } from "../../shared";
import { Advice } from "./advice";
import { Controller } from "./controller";

@Decorator()
export class ControllerAdviceDecorator extends ClassDecorator<[]> {
  apply<T extends Ctor>(target: T): void {
    Advice(Controller.decorator)(target);
  }
}

export const ControllerAdvice = () => Apply(ControllerAdviceDecorator);
ControllerAdvice.decorator = ControllerAdviceDecorator;
