/**
 * Renders a small-sized title text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H6 element.
 *
 * @format
 * @param props - The props for the TitleSmall component.
 * @interface ITypography extends TypographyProps
 * @returns The rendered TitleSmall component.
 */

import ITypography from '@/interfaces/ITypography';

export default function TitleSmall(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'color--black',
    'font-weight--500',
    'margin--0',
    'sm-font-size--12',
    'md-font-size--14',
    'line-height--auto',
  ];

  const Component = inline ? 'span' : 'h6';

  return (
    <Component
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </Component>
  );
}
