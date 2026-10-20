// @file examples/next-app-router/app/components/Box.tsx
// @description Box primitive that picks its classes from a typed map and a constant, outside className.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

const PADDING_CLASSES = { 24: 'padding--24', 40: 'padding--40' } as const;

export const BOX_BASE_CLASSES =
  'display--inline-flex align-items--center ' + 'border-radius--4 font-family--mono';

function joinClassNames(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(' ');
}

interface BoxProps {
  padding: keyof typeof PADDING_CLASSES;
  children: React.ReactNode;
}

export function Box({ padding, children }: BoxProps) {
  return (
    <div
      className={joinClassNames(BOX_BASE_CLASSES, PADDING_CLASSES[padding])}
      data-testid="map-box"
    >
      {children}
    </div>
  );
}
