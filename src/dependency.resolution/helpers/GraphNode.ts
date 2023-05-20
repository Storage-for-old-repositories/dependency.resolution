import { GraphNodeIsArleadyChildrenError } from "dependency.resolution/errors";

const castReadonly = <T>(value: T): Readonly<T> => value;

export default class GraphNode<T> {
  private readonly _children = new Set<GraphNode<T>>();
  private readonly _parents = new Set<GraphNode<T>>();

  private constructor(public readonly value: T) {}

  public static create<T>(): GraphNode<T | undefined>;
  public static create<T>(value: T): GraphNode<T>;
  public static create<T>(value?: T) {
    return new GraphNode<T>(value!);
  }

  public get children() {
    return castReadonly(this._children);
  }

  public get parents() {
    return castReadonly(this._parents);
  }

  public appendNode(node: GraphNode<T>) {
    this.assertNodeIsNotArleadyChild(node);
    this.appendNodeWithoutAsserting(node);
  }

  private assertNodeIsNotArleadyChild(node: GraphNode<T>) {
    if (this.nodeIsChild(node)) {
      throw new GraphNodeIsArleadyChildrenError();
    }
  }

  public nodeIsChild(node: GraphNode<T>) {
    return this._children.has(node);
  }

  private appendNodeWithoutAsserting(node: GraphNode<T>) {
    this._children.add(node);
    node._parents.add(this);
  }

  public growNode(value: T) {
    const node = new GraphNode<T>(value);
    this.appendNodeWithoutAsserting(node);
    return node;
  }

  public nodeIsParent(node: GraphNode<T>) {
    return this._parents.has(node);
  }

  public isRoot() {
    return this._parents.size === 0;
  }

  public isLeaf() {
    return this._children.size === 0;
  }
}
