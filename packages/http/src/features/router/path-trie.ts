import {
  HandlerPath,
  HandlerPathEntity,
  RawHandlerPath,
} from "@compositor/core";
import { HttpMethod } from "../../types";
import {
  PathToken,
  __internal_branching,
  __internal_joinPoint,
  or,
} from "../handler";
import { HttpHandler } from "./http-router";

export interface PathResolverMetadata {
  method: HttpMethod;
}

export class PathTrie {
  private _root: PathTrieNode;

  constructor() {
    const root = new PathTrieNode();
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
    const nextNode = this._root
      .getChildren()
      .find((node) => node.match(path[0], metadata));
    const handlerNode = this.searchPath(path, nextNode, metadata);

    if (!handlerNode) return null;
    switch (typeof handlerNode.getChildren()[0].value()) {
      case "function":
        return handlerNode.getChildren()[0].value() as HttpHandler;
      case "object":
        switch (
          (handlerNode.getChildren()[0].value() as HandlerPathEntity).token
        ) {
          case PathToken.Branching:
            for (const node of handlerNode.getChildren()[0].getChildren())
              if (typeof node.value() === "function")
                return node.value() as HttpHandler;
            return null;
        }
    }

    return null;
  }

  private searchPath(
    path: RawHandlerPath,
    root: PathTrieNode,
    metadata: PathResolverMetadata,
  ): PathTrieNode | null {
    let current = 0;
    let currentNode = root;

    while (current < path.length - 1) {
      const first = currentNode.getChildren()[0].valueAsToken();

      if (first && first.token === PathToken.Wildcard && first.data === true) {
        // a multi-segment wildcard
        // search for the correct next segment
      }

      if (
        first &&
        [PathToken.Branching, PathToken.Or, PathToken.JoinPoint].includes(
          first.token as PathToken,
        )
      ) {
        currentNode = currentNode.getChildren()[0];
        continue;
      }

      const nextNode = currentNode
        .getChildren()
        .find((node) => node.match(path[current + 1], metadata));
      if (!nextNode) return null;
      current += 1;
      currentNode = nextNode;
    }

    console.log(currentNode);

    return currentNode;
  }

  private pathTrieUnion(path: PathTrieNode, root: PathTrieNode) {
    if (
      typeof path.value() === "string" ||
      (path.value() as HandlerPathEntity).token !== PathToken.Or
    ) {
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
        typeof next === "object" &&
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

    // path is an Or token
    // for now, Or tokens must be implicitly branched
    // so it is impossible to have both "path" and "root" as Or tokens
    // all Or tokens are treated as new paths
    // for now
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

    if (
      typeof segment === "string" ||
      (segment as HandlerPathEntity).token !== PathToken.Or
    ) {
      const pathNode = new PathTrieNode();
      pathNode.setValue(segment);
      // string segments can only have one child node
      const childNode = this.pathConstruct(path, handler, current + 1);
      if (childNode) pathNode.addChild(childNode);
      return pathNode;
    }

    // construct an Or segment
    const pathNode = new PathTrieNode();
    pathNode.setValue(segment);
    const childSegments = (segment as ReturnType<typeof or>)
      .data as HandlerPath[];
    // construct child paths, treating each path as new
    const childNodes = childSegments.map((path) =>
      this.pathConstruct(path, null),
    );
    // append a JoinPoint token after all Or branches
    const joinPoint = new PathTrieNode();
    joinPoint.setValue(__internal_joinPoint());
    // iterate through the array of child nodes of an Or segment
    // append nodes to the child nodes array
    for (const node of childNodes) {
      if (!node) continue;
      const finalPathNode = this.getFinalNode(node);
      finalPathNode.addChild(joinPoint);
      pathNode.addChild(node);
    }
    // append the remaining path nodes to the join point
    joinPoint.addChild(this.pathConstruct(path, handler, current + 1));
    return pathNode;
  }

  private getFinalNode(node: PathTrieNode): PathTrieNode {
    if (node.getChildren().length === 0) return node;
    return this.getFinalNode(node.getChildren()[0]);
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
