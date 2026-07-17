/**
 * Renders a small-sized body text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H3 element.
 *
 * @format
 * @param props - The props for the BodySmall component.
 * @interface ITypography
 * @returns The rendered BodySmall component.
 */

import ITypography from '@/interfaces/ITypography';

export default function BodySmall(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'font-weight--300',
    'sm-font-size--10',
    'md-font-size--12',
    'lg-font-size--14',
    'xl-font-size--16',
    'xxl-font-size--22',
    'line-height--130',
  ];

  const Component = inline ? 'span' : 'p';

  return (
    <Component
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </Component>
  );
}
