// @file packages/ui/src/index.tsx
// @description Shared Banner component for monorepo scanning integration tests.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

interface BannerProps {
  message: string;
}

export function Banner({ message }: BannerProps) {
  return (
    <div
      className="display--flex align-items--center justify-content--center padding--16 background-color--black color--white"
      data-testid="ui-banner"
    >
      <p className="font-size--xs font-weight--700">{message}</p>
    </div>
  );
}
