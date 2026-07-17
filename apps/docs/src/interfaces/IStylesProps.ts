/**
 * Represents the IStylesProps interface, which provides properties for styling elements.
 * These properties can be used to apply CSS class names or inline styles to components.
 *
 * @format
 * @interface IStylesProps
 */

export default interface IStylesProps {
  /**
   * Specifies the CSS class name to be applied to the component.
   * This allows for custom styling using CSS classes.
   * @type {string}
   * @memberof IStylesProps
   */
  className?: string;

  /**
   * Specifies the inline style object to be applied to the component.
   * This allows for custom styling using inline styles.
   * @type {React.CSSProperties}
   * @memberof IStylesProps
   */
  style?: React.CSSProperties;
}
