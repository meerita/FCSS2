// @file examples/next-app-router/app/page.tsx
// @description Home page Server Component for the FCSS App Router example.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { Banner } from '@fcss/ui';
import { Card } from './components/Card';

export default function HomePage() {
  return (
    <main
      className="display--flex flex-direction--column align-items--center gap--16 padding--16"
      data-testid="app-root"
    >
      <h1 className="font-size--xs font-weight--700 color--black" data-testid="app-heading">
        FCSS App Router Example
      </h1>
      <Banner message="Shared UI component via monorepo scanning" />
      <Card title="Server-rendered card" description="Uses FCSS classes in a Server Component." />
    </main>
  );
}
