// @file packages/scanner/src/extractors/string-literals.ts
// @description Collects the text of every string literal and static template part in JS/TS source.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

// A one-pass lexer, not a parser. It tracks just enough state to tell where a
// literal starts and ends:
// - '...' and "..." strings, with backslash escapes;
// - template literals, whose static parts are collected and whose ${...}
//   expressions are lexed as code, so a string nested inside one is found too;
// - comments, which are skipped: a quote inside a comment never opens a
//   literal, and a class named only in a comment is not a candidate;
// - regex literals, which are skipped, so /['"]/ does not open a string.
//
// JSX text is not code, so two guards keep it from throwing the lexer off:
// - a quote right after a letter or digit (Don't, 5" screen) is text, since
//   no JS string can start there, unless the word is a keyword (return"x");
// - a '...' or "..." string ends at a line break, as JS requires, so a stray
//   quote in text costs at most one line. A string right after '=' may span
//   lines, because a JSX attribute value can.

const WORD_CHAR_RE = /[A-Za-z0-9_$]/;
const WHITESPACE_RE = /\s/;

// After one of these keywords a '/' opens a regex and a quote opens a string
// (minified code writes return"x"); after any other word a '/' divides and a
// quote is JSX text.
const KEYWORDS_BEFORE_VALUE = new Set([
  'return',
  'typeof',
  'instanceof',
  'in',
  'of',
  'new',
  'delete',
  'void',
  'throw',
  'case',
  'do',
  'else',
  'yield',
  'await',
]);

// A quote may also follow these words directly: import"x" and from"x".
const KEYWORDS_BEFORE_STRING = new Set([...KEYWORDS_BEFORE_VALUE, 'import', 'from']);

// After one of these punctuators a '/' opens a regex. ')', ']' and '}' end a
// value, so a '/' after them divides. '<' and '>' are left out for JSX: '</'
// closes a tag and '>' ends one before text.
const REGEX_PUNCTUATORS = new Set([
  '(',
  ',',
  '=',
  ':',
  '[',
  '!',
  '&',
  '|',
  '?',
  '{',
  ';',
  '+',
  '-',
  '*',
  '%',
  '~',
  '^',
  '=>',
  '...',
]);

const JS_ESCAPE_RE = /\\(?:u\{([0-9a-fA-F]+)\}|u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|(\r\n|[\s\S]))/g;

const SIMPLE_ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  v: '\v',
  f: '\f',
  b: '\b',
  '0': '\0',
};

// Turns the raw text between the quotes into the string's value, so that
// 'a\nb' splits into two tokens and 'it\'s' keeps its apostrophe.
function decodeEscapes(raw: string): string {
  if (!raw.includes('\\')) return raw;
  return raw.replace(
    JS_ESCAPE_RE,
    (_, braced?: string, u4?: string, x2?: string, ch?: string): string => {
      const hex = braced ?? u4 ?? x2;
      if (hex !== undefined) {
        const code = parseInt(hex, 16);
        return code <= 0x10ffff ? String.fromCodePoint(code) : '';
      }
      const c = ch ?? '';
      // A backslash before a line break continues the string on the next line.
      if (c === '\n' || c === '\r' || c === '\r\n' || c === '\u2028' || c === '\u2029') return '';
      return SIMPLE_ESCAPES[c] ?? c;
    },
  );
}

export function collectStringLiterals(source: string): string[] {
  const literals: string[] = [];
  const n = source.length;
  // One entry per open ${...}: the depth of '{' nested inside it.
  const templateStack: number[] = [];
  // The last token before the cursor, to tell a regex from a division.
  let lastToken = '';
  let i = 0;

  // Reads a template chunk from `start` (just past '`' or the '}' of a ${...})
  // to the closing '`' or the next '${'. Returns the index to resume from.
  function readTemplateChunk(start: number): number {
    let j = start;
    while (j < n) {
      const c = source[j];
      if (c === '\\') {
        j += 2;
        continue;
      }
      if (c === '`') {
        literals.push(decodeEscapes(source.slice(start, j)));
        lastToken = 'literal';
        return j + 1;
      }
      if (c === '$' && source[j + 1] === '{') {
        literals.push(decodeEscapes(source.slice(start, j)));
        templateStack.push(0);
        lastToken = '{';
        return j + 2;
      }
      j++;
    }
    // Unterminated: keep what was read.
    literals.push(decodeEscapes(source.slice(start, n)));
    return n;
  }

  // Returns the index of the closing quote, or -1 when the string does not end.
  function findQuoteEnd(start: number, quote: string, multiline: boolean): number {
    let j = start + 1;
    while (j < n) {
      const c = source[j];
      if (c === '\\') {
        j += 2;
        continue;
      }
      if (c === quote) return j;
      if (c === '\n' && !multiline) return -1;
      j++;
    }
    return -1;
  }

  // Returns the index just past the regex flags, or -1 when this '/' is not a regex.
  function findRegexEnd(start: number): number {
    let j = start + 1;
    let inClass = false;
    while (j < n) {
      const c = source[j];
      if (c === '\\') {
        j += 2;
        continue;
      }
      if (c === '\n') return -1;
      if (c === '[') inClass = true;
      else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) {
        j++;
        while (j < n && WORD_CHAR_RE.test(source[j] ?? '')) j++;
        return j;
      }
      j++;
    }
    return -1;
  }

  function regexAllowed(): boolean {
    return (
      lastToken === '' || REGEX_PUNCTUATORS.has(lastToken) || KEYWORDS_BEFORE_VALUE.has(lastToken)
    );
  }

  while (i < n) {
    const ch = source[i] ?? '';
    const next = source[i + 1];

    if (WHITESPACE_RE.test(ch)) {
      i++;
      continue;
    }

    if (ch === '/' && next === '/') {
      // 'https://' in JSX text is not a comment.
      if (source[i - 1] === ':' && WORD_CHAR_RE.test(source[i - 2] ?? '')) {
        i += 2;
        lastToken = '/';
        continue;
      }
      const end = source.indexOf('\n', i);
      i = end === -1 ? n : end + 1;
      continue;
    }

    if (ch === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const prev = source[i - 1] ?? '';
      if (WORD_CHAR_RE.test(prev) && !KEYWORDS_BEFORE_STRING.has(lastToken)) {
        i++;
        continue;
      }
      const end = findQuoteEnd(i, ch, prev === '=');
      if (end === -1) {
        i++;
        continue;
      }
      literals.push(decodeEscapes(source.slice(i + 1, end)));
      lastToken = 'literal';
      i = end + 1;
      continue;
    }

    if (ch === '`') {
      i = readTemplateChunk(i + 1);
      continue;
    }

    if (ch === '{') {
      const depth = templateStack.length;
      if (depth > 0) templateStack[depth - 1] = (templateStack[depth - 1] ?? 0) + 1;
      lastToken = '{';
      i++;
      continue;
    }

    if (ch === '}') {
      const depth = templateStack.length;
      if (depth > 0) {
        const open = templateStack[depth - 1] ?? 0;
        if (open === 0) {
          templateStack.pop();
          i = readTemplateChunk(i + 1);
          continue;
        }
        templateStack[depth - 1] = open - 1;
      }
      lastToken = '}';
      i++;
      continue;
    }

    if (ch === '/' && regexAllowed()) {
      const end = findRegexEnd(i);
      if (end !== -1) {
        lastToken = 'literal';
        i = end;
        continue;
      }
    }

    if (WORD_CHAR_RE.test(ch)) {
      let j = i + 1;
      while (j < n && WORD_CHAR_RE.test(source[j] ?? '')) j++;
      lastToken = source.slice(i, j);
      i = j;
      continue;
    }

    if (ch === '>' && source[i - 1] === '=') lastToken = '=>';
    else if (ch === '.' && source[i - 1] === '.' && source[i - 2] === '.') lastToken = '...';
    else lastToken = ch;
    i++;
  }

  return literals;
}
