import { Ctor } from "../../ioc";
import { Apply, ClassDecorator } from "../../shared";
import { Advice } from "./advice";
import { Controller } from "./controller";

export class ControllerAdviceDecorator extends ClassDecorator<[]> {
  apply<T extends Ctor>(target: T): void {
    Advice(Controller.decorator)(target);
  }
}

export const ControllerAdvice = () => Apply(ControllerAdviceDecorator);
ControllerAdvice.decorator = ControllerAdviceDecorator;
