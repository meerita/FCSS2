// @file examples/react-vite/src/App.tsx
// @description Root application component for the FCSS React+Vite example fixture.
// @layer ui
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { useState } from 'react';
import { Card } from './components/Card.js';

export default function App() {
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <main
      className="display--flex flex-direction--column align-items--center gap--4 padding--16"
      data-testid="app-root"
    >
      <h1 className="font-size--xs font-weight--700 color--black" data-testid="app-heading">
        FCSS React+Vite Example
      </h1>

      <div className="display--flex gap--4">
        <button
          className="cursor--pointer padding--16 background-color--black color--white"
          onClick={() => setExpanded((v) => !v)}
          type="button"
        >
          Toggle expanded
        </button>
        <button
          className="cursor--pointer padding--16 background-color--white color--black"
          onClick={() => setHidden((v) => !v)}
          type="button"
        >
          Toggle hidden
        </button>
      </div>

      <Card
        title="FCSS Card"
        description="Demonstrates base, responsive, pseudo-state, and ARIA FCSS classes."
        expanded={expanded}
        hidden={hidden}
        onToggle={() => setExpanded((v) => !v)}
      />
    </main>
  );
}
