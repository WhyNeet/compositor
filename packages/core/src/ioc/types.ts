import { AnyBeanDefinition, AnyBeanWrapper } from "./bean";
import { InjectionToken } from "./injection-token";

export interface Ctor {
  // biome-ignore lint/suspicious/noExplicitAny: suppress ts error
  new (...args: any[]): any;
}

export interface FieldArg {
  token: InjectionToken;
  property: string;
}

export type DependencyResolver = (
  definition: AnyBeanDefinition,
) => AnyBeanWrapper;

export type DefinitionResolver = (token: InjectionToken) => AnyBeanDefinition;
