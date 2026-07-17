/**
 * Renders a small-sized display text with optional inline display. The component
 * will render a SPAN element if the inline prop is true, otherwise it will
 * render a H3 element.
 *
 * @format
 * @param props - The props for the BodySmall component.
 * @interface ITypography extends TypographyProps
 * @returns The rendered DisplaySmall component.
 */

import ITypography from '@/interfaces/ITypography';

export default function DisplaySmall(props: ITypography): JSX.Element {
  const { inline, ...restProps } = props;

  const PROPERTIES = [
    'color--black',
    'font-weight--400',
    'margin--0',
    'sm-font-size--28',
    'md-font-size--36',
    'lg-font-size--40',
    'xl-font-size--44',
    'xxl-font-size--48',
    'line-height--150',
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
