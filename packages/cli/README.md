<!--
@file packages/cli/README.md
@description @functionalcss/cli package documentation — commands and configuration.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @functionalcss/cli

Command-line tool for FCSS: scaffold config, purge unused utilities, audit and explain classes.

## Installation

```bash
npm install -D @functionalcss/cli
```

## Commands

| Command                               | Description                                              |
| ------------------------------------- | -------------------------------------------------------- |
| `fcss init [-f <framework>] [-y]`     | Create `fcss.config.ts` and add the CSS import           |
| `fcss build`                          | Generate custom CSS from `fcss.config.ts`                |
| `fcss purge -i <in.css> -o <out.css>` | Remove utilities not found in your `content` globs       |
| `fcss audit`                          | Report unknown or invalid classes in source files        |
| `fcss doctor`                         | Check the installation                                   |
| `fcss list [-p] [-c] [-s] [-b]`       | List available classes, filtered by property, state, etc |
| `fcss explain <class>`                | Show what a class does                                   |
| `fcss migrate [--dry-run \| --force]` | Migrate from the legacy TFCSSF class names               |

Frameworks for `init`: `react`, `next`, `angular`, `astro`, `none`.

## Configuration

```ts
// fcss.config.ts
import { defineConfig } from '@functionalcss/cli';

export default defineConfig({
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  safelist: ['display--none'],
});
```

## License

MIT
