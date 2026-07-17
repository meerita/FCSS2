// @file packages/spec/src/index.ts
// @description Machine-readable FCSS specification — single entry point for all catalogs.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export type { FcssPropertyDefinition, FcssValueDefinition, FcssPropertyStatus, FcssNumericBehavior } from './types.js';
export { validatePropertyDefinition } from './validate.js';

// States
export type { FcssPseudoClassDefinition, PseudoClassCategory } from './states/pseudo-classes.js';
export {
  FCSS_PSEUDO_CLASSES,
  PC_INTERACTION,
  PC_WITH_LINK,
  PC_FORM,
  PC_ALL,
  PC_NONE,
} from './states/pseudo-classes.js';

export type { FcssAriaStateDefinition, AriaStateType } from './states/aria.js';
export { FCSS_ARIA_STATES, SUPPORTED_ARIA_STATES } from './states/aria.js';

// Breakpoints
export type { FcssBreakpoint } from './breakpoints.js';
export { FCSS_BREAKPOINTS } from './breakpoints.js';

// Value catalogs
export { FCSS_COLOR_VALUES } from './values/colors.js';
export { FCSS_GLOBAL_KEYWORDS } from './values/global-keywords.js';
export { FCSS_LENGTH_SCALE } from './values/length-scales.js';
export { FCSS_PERCENTAGE_SCALE } from './values/percentage-scales.js';
export { FCSS_TIMING_FUNCTIONS } from './values/timing-functions.js';

// Property catalogs
import { DISPLAY_PROPERTIES } from './properties/display.js';
import { POSITIONING_PROPERTIES } from './properties/positioning.js';
import { DIMENSIONS_PROPERTIES } from './properties/dimensions.js';
import { BOX_MODEL_PROPERTIES } from './properties/box-model.js';
import { FLEXBOX_PROPERTIES } from './properties/flexbox.js';
import { GRID_PROPERTIES } from './properties/grid.js';
import { ALIGNMENT_PROPERTIES } from './properties/alignment.js';
import { TYPOGRAPHY_PROPERTIES } from './properties/typography.js';
import { COLOR_PROPERTIES } from './properties/color.js';
import { BACKGROUND_PROPERTIES } from './properties/background.js';
import { BORDER_PROPERTIES } from './properties/border.js';
import { LISTS_PROPERTIES } from './properties/lists.js';
import { TABLES_PROPERTIES } from './properties/tables.js';
import { TRANSFORMS_PROPERTIES } from './properties/transforms.js';
import { TRANSITIONS_PROPERTIES } from './properties/transitions.js';
import { ANIMATION_PROPERTIES } from './properties/animation.js';
import { UI_PROPERTIES } from './properties/ui.js';
import { COLUMNS_PROPERTIES } from './properties/columns.js';
import { IMAGES_PROPERTIES } from './properties/images.js';
import { OVERFLOW_PROPERTIES } from './properties/overflow.js';
import { GENERATED_CONTENT_PROPERTIES } from './properties/generated-content.js';

export {
  DISPLAY_PROPERTIES,
  POSITIONING_PROPERTIES,
  DIMENSIONS_PROPERTIES,
  BOX_MODEL_PROPERTIES,
  FLEXBOX_PROPERTIES,
  GRID_PROPERTIES,
  ALIGNMENT_PROPERTIES,
  TYPOGRAPHY_PROPERTIES,
  COLOR_PROPERTIES,
  BACKGROUND_PROPERTIES,
  BORDER_PROPERTIES,
  LISTS_PROPERTIES,
  TABLES_PROPERTIES,
  TRANSFORMS_PROPERTIES,
  TRANSITIONS_PROPERTIES,
  ANIMATION_PROPERTIES,
  UI_PROPERTIES,
  COLUMNS_PROPERTIES,
  IMAGES_PROPERTIES,
  OVERFLOW_PROPERTIES,
  GENERATED_CONTENT_PROPERTIES,
};

import type { FcssPropertyDefinition } from './types.js';

export const FCSS_PROPERTIES: readonly FcssPropertyDefinition[] = [
  ...DISPLAY_PROPERTIES,
  ...POSITIONING_PROPERTIES,
  ...DIMENSIONS_PROPERTIES,
  ...BOX_MODEL_PROPERTIES,
  ...FLEXBOX_PROPERTIES,
  ...GRID_PROPERTIES,
  ...ALIGNMENT_PROPERTIES,
  ...TYPOGRAPHY_PROPERTIES,
  ...COLOR_PROPERTIES,
  ...BACKGROUND_PROPERTIES,
  ...BORDER_PROPERTIES,
  ...LISTS_PROPERTIES,
  ...TABLES_PROPERTIES,
  ...TRANSFORMS_PROPERTIES,
  ...TRANSITIONS_PROPERTIES,
  ...ANIMATION_PROPERTIES,
  ...UI_PROPERTIES,
  ...COLUMNS_PROPERTIES,
  ...IMAGES_PROPERTIES,
  ...OVERFLOW_PROPERTIES,
  ...GENERATED_CONTENT_PROPERTIES,
];
