/**
 * Renders a large-sized title text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H4 element.
 *
 * @format
 * @param props - inline, for defining the component as an SPAN element
 * and restProsps (like className, onClick, etc.).
 * @interface TypographyProps extends TypographyProps
 * @returns The rendered TitleLarge component.
 */

import ITypography from '@/interfaces/ITypography';

export default function TitleLarge(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'color--black',
    'font-weight--500',
    'margin--0',
    'sm-font-size--16',
    'md-font-size--22',
    'lg-font-size--24',
    'xl-font-size--28',
    'xxl-font-size--32',
    'line-height--auto',
  ];

  const Component = inline ? 'span' : 'h4';

  return (
    <Component
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </Component>
  );
}
