// @file examples/next-app-router/app/components/Card.tsx
// @description Interactive Card client component demonstrating FCSS with 'use client'.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

'use client';

import { useState } from 'react';

interface CardProps {
  title: string;
  description: string;
}

export function Card({ title, description }: CardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="display--flex flex-direction--column gap--8 padding--16 background-color--white"
      aria-expanded={expanded}
      data-testid="card"
    >
      <span
        className="font-weight--700 display--none:aria-expanded:false"
        data-testid="card-title"
      >
        {title}
      </span>
      <p className="font-size--xs color--black" data-testid="card-description">
        {description}
      </p>
      <button
        className="cursor--pointer padding--8 background-color--black color--white"
        type="button"
        onClick={() => setExpanded((v) => !v)}
        data-testid="card-button"
      >
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </article>
  );
}
