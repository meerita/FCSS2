// @file examples/next-app-router/app/[slug]/page.tsx
// @description Dynamic route page for the FCSS App Router example.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [{ slug: 'about' }, { slug: 'contact' }];
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  return (
    <div
      className="display--flex flex-direction--column align-items--center padding--32"
      data-testid="slug-page"
    >
      <h2 className="font-size--xs font-weight--700" data-testid="slug-title">
        {slug}
      </h2>
    </div>
  );
}
