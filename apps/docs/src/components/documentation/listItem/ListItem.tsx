/**
 * Renders a medium-sized body text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a P element.
 *
 * @format
 * @param props - The props for the BodyMedium component.
 * @interface ITypography
 * @returns The rendered BodyMedium component.
 */

import ITypography from '@/interfaces/ITypography';

export default function ListItem(props: ITypography): JSX.Element {
  const { ...restProps } = props;

  const PROPERTIES = [
    'color--dark-gray',
    'font-weight--300',
    'sm-font-size--12',
    'md-font-size--14',
    'lg-font-size--16',
    'xl-font-size--22',
    'xxl-font-size--24',
    'line-height--150',
  ];

  return (
    <li
      {...restProps}
      className={`${PROPERTIES.join(' ')} ${restProps.className}`}
    >
      {props.children}
    </li>
  );
}
