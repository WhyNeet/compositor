import { Events } from "../../shared";
import { AnyBeanDefinition, AnyBeanWrapper } from "../bean";

export enum ContainerEvent {
  CONTAINER_BOOTSTRAPPED = "CONTAINER_BOOTSTRAPPED",
  BEAN_DEFINED = "BEAN_DEFINED",
  BEAN_INSTANTIATED = "BEAN_INSTANTIATED",
}

export interface EventPayload {
  bean: AnyBeanWrapper;
  definition: AnyBeanDefinition;
}

export class ContainerEvents extends Events<ContainerEvent, EventPayload> {}
