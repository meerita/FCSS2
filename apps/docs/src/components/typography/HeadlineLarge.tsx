/**
 * Renders a big-sized headline with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H1 element.
 *
 * @format
 * @param props - The props for the BodySmall component.
 * @interface ITypography
 * @returns The rendered HeadlineLarge component.
 */

import ITypography from '@/interfaces/ITypography';

export default function HeadlineLarge(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'color--black',
    'font-weight--400',
    'margin--0',
    'sm-font-size--28',
    'md-font-size--32',
    'lg-font-size--36',
    'xl-font-size--40',
    'xxl-font-size--44',
    'line-height--130',
  ];

  const Component = inline ? 'span' : 'h1';

  return (
    <Component
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </Component>
  );
}
