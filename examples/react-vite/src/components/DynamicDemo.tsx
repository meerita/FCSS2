// @file examples/react-vite/src/components/DynamicDemo.tsx
// @description Anti-pattern demonstration — dynamic template literal in className triggers a
//   dev-mode warning from @fcss/vite. This component is intentionally NOT imported anywhere;
//   it exists solely so the scanner can detect the warning on dev start.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

interface Props {
  isActive: boolean;
}

// WRONG: template literal prevents static analysis. Use a class map (see Card.tsx) instead.
export function DynamicDemo({ isActive }: Props) {
  const state = isActive ? 'active' : 'inactive';
  return <div className={`display--flex opacity--${state}`}>Dynamic demo (do not use)</div>;
}
