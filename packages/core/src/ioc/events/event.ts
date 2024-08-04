import { BeanDefinition, BeanWrapper } from "../bean";
import { Ctor } from "../types";

export enum ContainerEvent {
  CONTAINER_BOOTSTRAPPED = "CONTAINER_BOOTSTRAPPED",
  BEAN_DEFINED = "BEAN_DEFINED",
  BEAN_REGISTERED = "BEAN_REGISTERED",
  BEAN_INSTANTIATED = "BEAN_INSTANTIATED",
}

export interface EventData {
  type: ContainerEvent;
  // biome-ignore lint/suspicious/noExplicitAny: there are event types w/o any payload, thus a generic parameter on EventData is not a good idea
  payload: EventPayload<any> | null;
}

export interface EventPayload<T extends Ctor> {
  bean: BeanWrapper<T> | null;
  definition: BeanDefinition<T>;
}

export type EventListener = (data: EventData) => void;
