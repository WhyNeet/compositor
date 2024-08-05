export type ParamDecoratorFactory = (req: unknown, res: unknown) => unknown;
export interface ProvisionedFactory {
  index: number;
  factory: ParamDecoratorFactory;
}

export function createParamDecorator(factory: ParamDecoratorFactory) {
  return function (
    // biome-ignore lint/complexity/useArrowFunction: not using arrow function
    // biome-ignore lint/suspicious/noExplicitAny: any target allowed
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    const provide: ProvisionedFactory[] = Reflect.getOwnMetadata(
      propertyKey,
      target,
    );
    provide.push({ index: parameterIndex, factory });
    Reflect.defineMetadata(propertyKey, provide, target);
  };
}
