/**
 * Renders a small-sized body text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H3 element.
 *
 * @format
 * @param props - The props for the BodySmall component.
 * @returns The rendered BodySmall component.
 */

import ITypography from '@/interfaces/ITypography';

export default function DisplayLarge(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const baseCSSProperties = [
    'color--black',
    'font-weight--400',
    'margin--0',
    'sm-font-size--45',
    'md-font-size--57',
    'line-height--100',
    'c-kerning',
  ];

  const Component = inline ? 'span' : 'h1';

  return (
    <Component
      {...restProps}
      className={`${baseCSSProperties.join(' ')} ${props.className}`}
    >
      {props.children}
    </Component>
  );
}
