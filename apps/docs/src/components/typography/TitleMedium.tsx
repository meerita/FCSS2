/**
 * Renders a medium-sized title text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H5 element.
 *
 * @format
 * @param props - The props for the TitleMedium component.
 * @interface ITypography extends TypographyProps
 * @returns The rendered TitleMedium component.
 */

import ITypography from '@/interfaces/ITypography';

export default function TitleMedium(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'font-weight--700',
    'margin--0',
    'sm-font-size--14',
    'md-font-size--16',
    'lg-font-size--18',
    'xl-font-size--20',
    'xxl-font-size--22',
    'line-height--auto',
  ];

  const Component = inline ? 'span' : 'h5';

  return (
    <Component
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </Component>
  );
}
