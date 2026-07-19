// @file examples/zed-validation/src/App.tsx
// @description Zed extension validation fixture — TSX with FCSS className attributes exercising
//              completions, hover, diagnostics (conflict, duplicate, invalid-condition-chain,
//              dynamic-purge-risk). Load packages/zed as a dev extension in Zed, open this project.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

interface Props {
  variant?: string;
}

export function App({ variant }: Props) {
  return (
    <main className="display--flex flex-direction--column align-items--center padding--32">
      {/* VALID — hover any class to see generated CSS; type to trigger completions */}
      <h1 className="font-size--24 font-weight--700 margin-bottom--8">Zed Validation (TSX)</h1>

      {/* DIAGNOSTIC: fcss/conflict — display--flex and display--block conflict on `display` */}
      <div className="display--flex display--block">Conflict</div>

      {/* DIAGNOSTIC: fcss/duplicate — margin--16 appears twice */}
      <div className="margin--16 margin--16">Duplicate</div>

      {/* DIAGNOSTIC: fcss/invalid-condition-chain — two pseudo-conditions not allowed */}
      <div className="opacity--0:hover:focus">Invalid condition chain</div>

      {/*
       * DIAGNOSTIC: fcss/dynamic-purge-risk
       * Template literal class construction cannot be statically purged.
       * Expected: info diagnostic on the template literal fragment.
       */}
      <div className={`display--${variant ?? 'flex'}`}>Dynamic purge risk</div>

      {/*
       * NOTE: fcss/deprecated-class is not triggerable with the current @fcss/core manifest.
       * See index.html comment for details.
       */}
    </main>
  );
}
