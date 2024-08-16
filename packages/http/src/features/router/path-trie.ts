import {
  HandlerPath,
  HandlerPathEntity,
  RawHandlerPath,
} from "@compositor/core";
import { HttpMethod } from "../../types";
import { PathToken, __internal_branching } from "../handler";
import { HttpHandler } from "./http-router";

export interface PathResolverMetadata {
  method: HttpMethod;
}

export class PathTrie {
  private _root: PathTrieNode;

  constructor() {
    const root = new PathTrieNode();
    root.setValue(__internal_branching());
    this._root = root;
  }

  public addPath(path: HandlerPath, handler: HttpHandler) {
    const pathRoot = this.pathConstruct(path, handler);

    // edge case: the PathTrie root does not have value
    // in case it does not have the child node similar to pathRoot
    // simply append the path root
    const nextNode = this._root
      .getChildren()
      .find((node) => node.equal(pathRoot));
    if (!nextNode) return this._root.addChild(pathRoot);

    this.pathTrieUnion(pathRoot, nextNode);
  }

  public resolvePath(
    path: RawHandlerPath,
    metadata: PathResolverMetadata,
  ): HttpHandler | null {
    const handlerNode = this.searchPath(path, this._root, metadata);

    if (handlerNode === null) return null;
    return handlerNode.value() as HttpHandler;
  }

  private searchPath(
    path: RawHandlerPath,
    root: PathTrieNode,
    metadata: PathResolverMetadata,
    current = 0,
  ): PathTrieNode | null {
    const switchOnObject = (): PathTrieNode | null => {
      const value = root.value() as HandlerPathEntity;
      switch (value.token) {
        case PathToken.Method:
          if (value.data !== metadata.method) return null;
          return this.searchPath(
            path,
            root.getChildren()[0],
            metadata,
            current,
          );
        case PathToken.Param:
          console.warn(
            `[warn] Path params are not implemented yet (param: "${value.data}" (value: "${path[current]}"))`,
          );
          return this.searchPath(
            path,
            root.getChildren()[0],
            metadata,
            current,
          );
        case PathToken.Wildcard:
          // TODO: implement multi-segment wildcards (e. g. /first/**/second)
          if (value.data === true)
            return this.searchPath(
              path,
              root.getChildren()[0],
              metadata,
              current + 1,
            );
          return this.searchPath(
            path,
            root.getChildren()[0],
            metadata,
            current + 1,
          );
        case PathToken.Branching:
          return (
            root
              .getChildren()
              .map((node) => this.searchPath(path, node, metadata, current))
              .find((node) => node !== null) ?? null
          );
      }
    };

    switch (typeof root.value()) {
      case "string":
        // root is a path segment
        if (path[current] !== root.value()) return null;
        return this.searchPath(
          path,
          root.getChildren()[0],
          metadata,
          current + 1,
        );
      case "function":
        if (current === path.length) return root;
        return null;
      case "object":
        return switchOnObject();
    }
  }

  private pathTrieUnion(path: PathTrieNode, root: PathTrieNode) {
    if (typeof path.value() === "string") {
      const childNode = path.getChildren()[0];
      const next = root.getChildren()[0];
      if (
        !next.equal(childNode) &&
        !(
          typeof next.value() === "object" &&
          (next.value() as HandlerPathEntity).token === PathToken.Branching
        )
      ) {
        const branchingNode = new PathTrieNode();
        branchingNode.setValue(__internal_branching());
        branchingNode.addChild(childNode);
        branchingNode.addChild(next);
        root.replaceChild(0, branchingNode);
        // since a new branch just got added
        // simply stop the execution here because there is nothing else to insert
        return;
      }
      if (
        typeof next.value() === "object" &&
        (next.value() as HandlerPathEntity).token === PathToken.Branching
      ) {
        // if the next token is a branching token
        // either find the equal child node
        // or insert a new one
        const branchNext = next
          .getChildren()
          .find((node) => node.equal(childNode));
        if (!branchNext) {
          next.addChild(childNode);
          return;
        }
        return this.pathTrieUnion(childNode, branchNext);
      }
      return this.pathTrieUnion(childNode, next);
    }
  }

  private pathConstruct(
    path: HandlerPath,
    // null value must be provided when resolving a subpath
    handler: HttpHandler | null,
    current = 0,
  ): PathTrieNode | null {
    if (current === path.length) {
      if (handler) {
        const handlerNode = new PathTrieNode();
        handlerNode.setValue(handler);
        return handlerNode;
      }

      return null;
    }

    const segment = path[current];

    const pathNode = new PathTrieNode();
    pathNode.setValue(segment);
    // string segments can only have one child node
    const childNode = this.pathConstruct(path, handler, current + 1);
    if (childNode) pathNode.addChild(childNode);
    return pathNode;
  }
}

export class PathTrieNode {
  private _children: PathTrieNode[] = [];
  private _value: string | HandlerPathEntity | HttpHandler;

  public setValue(value: string | HandlerPathEntity | HttpHandler) {
    this._value = value;
  }

  public value() {
    return this._value;
  }

  public valueAsToken() {
    if (typeof this.value() !== "string" && typeof this.value() !== "function")
      return this.value() as HandlerPathEntity;
  }

  public equal(other: PathTrieNode) {
    switch (typeof other.value()) {
      case "string":
        return typeof this._value === "string" && this._value === other.value();
      case "function":
        return false;
      default:
        return (
          typeof this._value === "object" &&
          (this._value as HandlerPathEntity).token ===
            (other.value() as HandlerPathEntity).token &&
          (this._value as HandlerPathEntity).data ===
            (other.value() as HandlerPathEntity).data
        );
    }
  }

  public match(other: string, metadata: PathResolverMetadata) {
    if (typeof this.value() === "string") {
      return this.value() === other;
    }

    if (typeof this.value() === "function") return false;

    switch ((this.value() as HandlerPathEntity).token) {
      case PathToken.Param:
      case PathToken.Wildcard:
        return true;
      case PathToken.Method:
        return (this.value() as HandlerPathEntity).data === metadata.method;
      default:
        return false;
    }
  }

  public addChild(node: PathTrieNode) {
    this._children.push(node);
  }

  public replaceChild(idx: number, node: PathTrieNode): PathTrieNode {
    const current = this._children[idx];

    this._children[idx] = node;

    return current;
  }

  public getChildren() {
    return this._children;
  }
}
