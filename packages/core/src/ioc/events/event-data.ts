import {
  AnyBeanDefinition,
  AnyBeanWrapper,
  BeanDefinition,
  BeanWrapper,
} from "../bean";
import { Ctor } from "../types";
import { ContainerEvent, EventData, EventPayload } from "./event";

export function constructEventData(type: ContainerEvent): EventData;
export function constructEventData(
  type: ContainerEvent,
  bean: AnyBeanWrapper,
): EventData;
export function constructEventData(
  type: ContainerEvent,
  definition: AnyBeanDefinition,
): EventData;
export function constructEventData(
  type: ContainerEvent,
  definition: AnyBeanDefinition,
  bean: AnyBeanWrapper,
): EventData;

export function constructEventData(
  type: ContainerEvent,
  beanOrDefinition?: AnyBeanWrapper | AnyBeanDefinition,
  bean?: AnyBeanWrapper,
): EventData {
  return {
    type,
    payload: beanOrDefinition
      ? {
          bean:
            bean ?? beanOrDefinition instanceof BeanWrapper
              ? (beanOrDefinition as AnyBeanWrapper)
              : null,
          definition:
            beanOrDefinition instanceof BeanDefinition
              ? (beanOrDefinition as AnyBeanDefinition)
              : null,
        }
      : null,
  };
}
