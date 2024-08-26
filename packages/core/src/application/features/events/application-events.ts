import { Events } from "../../../shared";
import { ApplicationEvent, ApplicationEventPayload } from "./event-data";

export class ApplicationEvents extends Events<
  ApplicationEvent,
  ApplicationEventPayload
> {}
