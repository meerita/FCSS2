---
'@functionalcss/scanner': patch
'@functionalcss/next': patch
'@functionalcss/postcss': patch
'@functionalcss/vite': patch
'@functionalcss/astro': patch
'@functionalcss/cli': patch
---

`@functionalcss/scanner` drops `fast-glob` for `tinyglobby`, so no FCSS package depends on `braces` any more. `braces` 3.0.3 has a high-severity advisory with no fixed release ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack exhaustion on deeply nested patterns), and it reached every project through `fast-glob > micromatch > braces`. The `content` patterns match the same files, with two edge cases that now match fewer: a pattern that leaves the project and comes back into it (`../**/*.tsx`), and a dot directory after a globstar (`**/.hidden/*`).
