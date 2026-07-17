/**
 * Represents the ITypography interface, which extends IStylesProps and IChildren interfaces.
 * It provides properties related to typography and can be used for styling text elements.
 *
 * @format
 * @interface ITypography - Represents the ITypography interface.
 * @extends IStylesProps - Extends IStylesProps interface.
 * @extends IChildren - Extends IChildren interface.
 */

import IChildren from './IChildren';
import IStylesProps from './IStylesProps';

export default interface ITypography extends IStylesProps, IChildren {
  /**
   * Specifies whether the text should be displayed inline.
   * If true, the text will be displayed in the same line as its siblings.
   * If false or not specified, the text will be displayed in a new line.
   * @type {boolean}
   * @memberof ITypography
   */
  inline?: boolean;
}
