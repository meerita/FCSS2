// @file examples/next-pages-router/pages/index.tsx
// @description Home page for the FCSS Pages Router example fixture.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { useState } from 'react';

export default function HomePage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main
      className="display--flex flex-direction--column align-items--center gap--16 padding--16"
      data-testid="pages-root"
    >
      <h1 className="font-size--xs font-weight--700 color--black" data-testid="pages-heading">
        FCSS Pages Router Example
      </h1>
      <article
        className="display--flex flex-direction--column gap--8 padding--16 background-color--white"
        data-testid="pages-card"
      >
        <button
          className="cursor--pointer padding--8 background-color--black color--white"
          type="button"
          onClick={() => setExpanded((v) => !v)}
          data-testid="pages-button"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
        {expanded && (
          <p className="font-size--xs color--black" data-testid="pages-content">
            Content visible
          </p>
        )}
      </article>
    </main>
  );
}
