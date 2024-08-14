import { HandlerPath, HandlerPathEntity } from "@compositor/core";
import { HttpMethod } from "../../types";

export enum PathToken {
  Method = "METHOD",
  Or = "OR",
  Param = "PARAM",
  Wildcard = "WILDCARD",
}

export function method(method: HttpMethod): HandlerPathEntity {
  return { token: PathToken, data: method };
}

export function or(...paths: HandlerPath[]): HandlerPathEntity {
  return { token: PathToken.Or, data: paths };
}

export function param(name: string): HandlerPathEntity {
  return { token: PathToken.Param, data: name };
}

export function wildcard(double = false): HandlerPathEntity {
  return { token: PathToken.Wildcard, data: double };
}
