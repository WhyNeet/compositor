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

export interface PathResolverOutputMetadata {
  // a map of route param names and their values
  params: Map<string, string>;
  // a map of raw route strings in place of wildcards
  paths: Map<string, string>;
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
  ): [HttpHandler, PathResolverOutputMetadata | null] | null {
    const handlerNode = this.searchPath(path, this._root, metadata);

    if (handlerNode === null) return null;
    const [handler, meta] = handlerNode;
    return [handler.value() as HttpHandler, meta];
  }

  private searchPath(
    path: RawHandlerPath,
    root: PathTrieNode,
    metadata: PathResolverMetadata,
    current = 0,
  ): [PathTrieNode, PathResolverOutputMetadata | null] | null {
    const switchOnObject = ():
      | [PathTrieNode, PathResolverOutputMetadata | null]
      | null => {
      const value = root.value() as HandlerPathEntity;
      switch (value.token) {
        case PathToken.Method:
          if (value.data !== metadata.method) return null;
          {
            const result = this.searchPath(
              path,
              root.getChildren()[0],
              metadata,
              current,
            );
            if (!result) return null;
            const [node, nextMeta] = result;
            return node ? [node, nextMeta] : null;
          }
        case PathToken.Param: {
          const result = this.searchPath(
            path,
            root.getChildren()[0],
            metadata,
            current + 1,
          );
          if (!result) return null;
          const [node, nextMeta] = result;
          // if metadata has been returned from the function call
          // update it with a new value
          if (nextMeta)
            nextMeta.params.set(value.data as string, path[current]);
          return node
            ? [
                node,
                // if there is metadata returned from the searchPath call, pass it
                // otherwise, create a new one with correct data
                nextMeta ?? {
                  paths: new Map(),
                  params: new Map([[value.data as string, path[current]]]),
                },
              ]
            : null;
        }
        case PathToken.Wildcard:
          if ((value.data as { double: boolean }).double === true) {
            // multi-segment wildcards (e. g. /first/**/second)
            const nextPaths = this.searchNextPaths(root, metadata);
            // since it is a double wildcard, it can catch all segments after it
            // so if it has a handler afterwards, simply return that handler node
            const handler = nextPaths.find(
              (node) => typeof node.value() === "function",
            );
            if (handler)
              return [
                handler,
                {
                  params: new Map(),
                  paths: new Map([
                    [
                      (value.data as { name: string }).name,
                      path.slice(current).join("/"),
                    ],
                  ]),
                },
              ];
            const nextPathStrings = nextPaths.map(
              (node) => node.value() as string,
            );
            const nextNodeAndIdx = () => {
              let nextIdx = current;
              while (nextIdx < path.length) {
                const idx = nextPathStrings.indexOf(path[nextIdx]);
                if (idx !== -1) return [nextIdx, idx];
                nextIdx += 1;
              }
              return null;
            };
            const next = nextNodeAndIdx();
            if (!next) return null;
            const [nextIdx, nextNodeIdx] = next;
            const result = this.searchPath(
              path,
              nextPaths[nextNodeIdx],
              metadata,
              nextIdx,
            );
            if (!result) return null;
            const [node, nextMeta] = result;

            if (nextMeta)
              if ((value.data as { name?: string }).name)
                nextMeta.paths.set(
                  (value.data as { name?: string }).name,
                  path.slice(current, nextIdx).join("/"),
                );
            return node
              ? [
                  node,
                  nextMeta ?? {
                    paths: new Map(),
                    params: (value.data as { name?: string }).name
                      ? new Map([
                          [
                            value.data as string,
                            path.slice(current, nextIdx).join("/"),
                          ],
                        ])
                      : new Map(),
                  },
                ]
              : null;
          }
          {
            const result = this.searchPath(
              path,
              root.getChildren()[0],
              metadata,
              current + 1,
            );
            if (!result) return null;
            const [node, nextMeta] = result;

            if (nextMeta)
              if ((value.data as { name?: string }).name)
                nextMeta.paths.set(
                  (value.data as { name?: string }).name,
                  path[current],
                );
            return node
              ? [
                  node,
                  nextMeta ?? {
                    paths: new Map(),
                    params: (value.data as { name?: string }).name
                      ? new Map([[value.data as string, path[current]]])
                      : new Map(),
                  },
                ]
              : null;
          }
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
        if (current === path.length) return [root, null];
        return null;
      case "object":
        return switchOnObject();
    }
  }

  private searchNextPaths(
    node: PathTrieNode,
    metadata: PathResolverMetadata,
  ): PathTrieNode[] {
    switch (typeof node.value()) {
      case "string":
        return [node];
      case "function":
        return [node];
      case "object":
        switch (node.valueAsToken().token) {
          case PathToken.Method:
            node.match("", metadata);
            return this.searchNextPaths(node.getChildren()[0], metadata);
          case PathToken.Wildcard:
          case PathToken.Param:
            return this.searchNextPaths(node.getChildren()[0], metadata);
          case PathToken.Branching:
            return node
              .getChildren()
              .flatMap((n) => this.searchNextPaths(n, metadata));
        }
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
