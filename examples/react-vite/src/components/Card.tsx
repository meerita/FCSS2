// @file examples/react-vite/src/components/Card.tsx
// @description Representative FCSS component — demonstrates base, responsive, pseudo-state, and ARIA classes.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

interface CardProps {
  title: string;
  description: string;
  expanded?: boolean;
  hidden?: boolean;
  onToggle?: () => void;
}

// Correct FCSS pattern: static class map avoids template literals so the scanner can analyse it.
const opacityByState: Record<string, string> = {
  active: 'opacity--1',
  inactive: 'opacity--0.5',
};

export function Card({
  title,
  description,
  expanded = false,
  hidden = false,
  onToggle,
}: CardProps) {
  const descriptionClass = opacityByState[expanded ? 'active' : 'inactive'] ?? 'opacity--1';

  return (
    <article
      className="display--flex flex-direction--column gap--4 padding--16 background-color--white"
      aria-hidden={hidden}
      aria-expanded={expanded}
    >
      {/* ARIA-state class: hides the title badge when aria-hidden is true */}
      <span
        className="display--block font-weight--700 display--none:aria-hidden:true"
        data-testid="card-title"
      >
        {title}
      </span>

      {/* Responsive class: flex on mobile, grid at sm breakpoint */}
      <div className="display--flex sm-display--grid gap--2" data-testid="card-body">
        <p
          className={`font-size--xs color--black ${descriptionClass}`}
          data-testid="card-description"
        >
          {description}
        </p>
      </div>

      {/* Pseudo-state: hover dimming via opacity--0.5:hover */}
      <button
        className="cursor--pointer display--block padding--16 background-color--black color--white opacity--0.5:hover"
        data-testid="card-button"
        type="button"
        onClick={onToggle}
      >
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </article>
  );
}
