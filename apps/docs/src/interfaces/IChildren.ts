/**
 * Represents the IChildren interface, which provides a property for holding React nodes as children.
 * It is typically used to define components that can accept React elements as their children.
 *
 * @format
 * @interface IChildren
 */

export default interface IChildren {
  /**
   * The children of the component, represented as a React node.
   * This property allows the component to receive and render React elements as its children.
   * @type {React.ReactNode}
   * @memberof IChildren
   */
  children: React.ReactNode;
}
