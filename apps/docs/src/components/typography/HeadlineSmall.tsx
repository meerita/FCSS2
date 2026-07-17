/**
 * Renders a small-sized body text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H3 element.
 *
 * @format
 * @param props - The props for the BodySmall component.
 * @interface ITypography extends TypographyProps
 * @returns The rendered BodySmall component.
 */

import ITypography from '@/interfaces/ITypography';

export default function HeadlineSmall(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'font-weight--400',
    'margin--0',
    'sm-font-size--22',
    'md-font-size--24',
    'line-height--auto',
  ];

  const Component = inline ? 'span' : 'h3';

  return (
    <Component
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </Component>
  );
}
