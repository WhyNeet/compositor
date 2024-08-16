import { HandlerPathEntity } from "@compositor/core";
import { HttpMethod } from "../../types";

export enum PathToken {
  Method = "METHOD",
  Param = "PARAM",
  Wildcard = "WILDCARD",
  Branching = "BRANCHING",
}

export function method(method: HttpMethod): HandlerPathEntity {
  return { token: PathToken.Method, data: method };
}

export function param(name: string): HandlerPathEntity {
  return { token: PathToken.Param, data: name };
}

export function wildcard(double = false): HandlerPathEntity {
  return { token: PathToken.Wildcard, data: double };
}

export function __internal_branching(): HandlerPathEntity {
  return { token: PathToken.Branching, data: null };
}
