/**
 * Renders a medium-sized headline title with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H2 element.
 *
 * @format
 * @param props - The props for the HeadlineMedium component.
 * @interface ITypography extends TypographyProps
 * @returns The rendered HeadlineMedium component.
 */

import ITypography from '@/interfaces/ITypography';

export default function HeadlineMedium(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'font-weight--400',
    'margin--0',
    'sm-font-size--22',
    'md-font-size--28',
    'line-height--auto',
  ];

  const Component = inline ? 'span' : 'h2';

  return (
    <Component
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </Component>
  );
}
