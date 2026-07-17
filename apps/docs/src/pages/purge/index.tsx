/** @format */
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Head from 'next/head';
import Link from 'next/link';
import DisplayLarge from '@/components/typography/DisplayLarge';
import Main from '@/components/documentation/main';
import BodyLarge from '@/components/typography/BodyLarge';
import BodyMedium from '@/components/typography/BodyMedium';
import BodySmall from '@/components/typography/BodySmall';
import TitleLarge from '@/components/typography/TitleLarge';
import HeadlineLarge from '@/components/typography/HeadlineLarge';
import HeadlineMedium from '@/components/typography/HeadlineMedium';

export default function Purge() {
  return (
    <>
      <Head>
        <title>How to purge unused CSS</title>
        <meta
          name='description'
          content='FCSSF (The Functional CSS Framework) is a versatile and lightweight functional CSS framework that simplifies the process of styling web applications. This repository contains the core FCSSF CSS files, a Next.js documentation application, and some basic React components. '
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Main>
        <BodySmall>
          <Link href='/'>Home</Link>
        </BodySmall>
        <DisplayLarge>How to purge unused CSS</DisplayLarge>
        <BodyLarge>
          To exploit the full potential of Functional CSS, you must purge unused
          CSS. Purging unused CSS is the process of removing unused CSS from
          your application.
        </BodyLarge>
        <BodyMedium>
          This process is essential because it reduces the size of your CSS
          files, which in turn reduces the size of your application. This
          process is especially important for Functional CSS because it is a
          utility-based approach, this means that it provides a a full set of
          utility classes that you can use to style your application. However,
          you will not use all of these classes in your application. Therefore,
          you must remove the unused classes from your CSS files.
        </BodyMedium>
        <HeadlineLarge>Let&apos;s purge your CSS</HeadlineLarge>
        <BodyMedium>
          First, let&apos;s go to{' '}
          <a href='https://purgecss.com/' title=''>
            Purge CSS website
          </a>{' '}
          and{' '}
          <a href='https://purgecss.com/getting-started.html'>
            read the instructions
          </a>
          . Then, on your React or Next.js project, install the following
          packages:
        </BodyMedium>
        <SyntaxHighlighter language='bash' style={dracula}>
          {`$ npm install -D @fullhuman/postcss-purgecss postcss-cli`}
        </SyntaxHighlighter>
        <BodyMedium>
          Then, create a <code>postcss.config.js</code> file in the root of your
          project and add the following code:
        </BodyMedium>
        <SyntaxHighlighter language='jsx' style={dracula}>
          {`module.exports = {
  plugins: [
    process.env.NODE_ENV === "production" &&
      require("@fullhuman/postcss-purgecss")({
        content: ["./src/**/*.ts", "./src/**/*.tsx"],
        css: ["./src/**/*.css"],
        extractors: [
          {
            extractor: (content) => {
              return content.match(/[\w-/:]+(?<!:)/g) || [];
            },
            extensions: ["js", "jsx", "ts", "tsx"],
          },
          {
            extractor: (content) => {
              return content.match(/[A-Za-z0-9-_]/g) || [];
            },
          },
        ],
        defaultExtractor: (content) => content.match(/[A-Za-z0-9-_]+/g) || [],
      }),
  ],
};
`}
        </SyntaxHighlighter>
        <BodyMedium>
          Once you have done this, you can run the <code>build</code> command to
          build your application. This will remove all unused CSS from your CSS
          files.
        </BodyMedium>
        <HeadlineMedium>Results</HeadlineMedium>
        <BodyMedium>
          This is the size of the CSS file before purging:
        </BodyMedium>
        <SyntaxHighlighter language='bash' style={dracula}>
          {`➜  my-project git:(master) ✗ yarn build
yarn run v1.22.19
warning ../package.json: No license field
$ tsc && vite build
vite v4.4.3 building for production...
✓ 355 modules transformed.
dist/index.html                   4.91 kB │ gzip:   3.23 kB
dist/assets/index-68360dbd.css   73.53 kB │ gzip:  10.97 kB
dist/assets/index-d487f6ea.js   417.47 kB │ gzip: 135.83 kB
✓ built in 1.42s
✨  Done in 3.81s.
`}
        </SyntaxHighlighter>
        <BodyMedium>
          Now, this is the size of the CSS file after purging:
        </BodyMedium>
        <SyntaxHighlighter language='bash' style={dracula}>
          {`➜  my-project git:(master) ✗ yarn build
yarn run v1.22.19
$ tsc && vite build
vite v4.4.8 building for production...
✓ 355 modules transformed.
dist/index.html                   4.94 kB │ gzip:   3.24 kB
dist/assets/index-d51e3b68.css    5.62 kB │ gzip:   1.71 kB
dist/assets/index-fd725c76.js   417.47 kB │ gzip: 135.82 kB
✓ built in 8.30s
Done in 13.71s.
`}
        </SyntaxHighlighter>
        <BodyMedium>
          As you can see, the size of the CSS file has been reduced from{' '}
          <code>73.53 kB</code> to <code>5.62 kB</code>. This is a huge size of
          reduction. This will make your application load faster. It&apos;s a
          92.37% reduction, and the gzipped it&apos;s 84.38%
        </BodyMedium>
      </Main>
    </>
  );
}
