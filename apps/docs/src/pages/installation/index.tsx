/** @format */
import Head from 'next/head';
import Link from 'next/link';
import DisplayLarge from '@/components/typography/DisplayLarge';
import Main from '@/components/documentation/main';
import BodyLarge from '@/components/typography/BodyLarge';
import BodyMedium from '@/components/typography/BodyMedium';
import BodySmall from '@/components/typography/BodySmall';
import TitleLarge from '@/components/typography/TitleLarge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Installation() {
  return (
    <>
      <Head>
        <title>Installation - The Functional CSS Framework (TFCSSF)</title>
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
        <DisplayLarge>Installation</DisplayLarge>
        <BodyLarge>
          FCSSF (The Functional CSS Framework) is an agnostic framework. It
          doesn&apos;t require anything to run but a modern browser. However,
          you can use it with any framework or library you want. In this guide,
          we will show you how to install properly.
        </BodyLarge>
        <TitleLarge>Running this project locally</TitleLarge>
        <BodyMedium>
          Go to the{' '}
          <a href='https://github.com/meerita/tfcssf'>TFCSSF repository</a> and
          clone it. Then, go to the root folder and run:
        </BodyMedium>
        <SyntaxHighlighter language='bash' style={dracula}>
          {`➜  tfcssf git:(main) ✗ yarn && yarn dev`}
        </SyntaxHighlighter>

        <BodyMedium>
          Browse the <code>src/styles</code> folder for the CSS files. You will
          find this:
        </BodyMedium>

        <SyntaxHighlighter language='bash' style={dracula}>
          {`→ tfcssf git:(main) cd src/styles
→ styles git:(master) ls -la
total 376
  320 Jul 21 11:59 .
  192 Jul 21 13:29 ..
  106 Aug 14 16:53 custom.css
49111 Aug 17 15:54 focus.css
44933 Aug 17 15:25 generics.css
49111 Aug 17 14:52 hovers.css
29062 Aug 14 10:16 lg.css
29021 Aug 14 10:16 md.css
 1037 Jul 21 11:59 normalizer.css
  865 Jul 21 11:59 root.css
28514 Aug 14 10:16 sm.css
29017 Aug 14 10:16 xl.css`}
        </SyntaxHighlighter>

        <BodyMedium>
          These are the most important files for your project. You can use them
          as you want. So, imagine you have a React or Next.js project, go to{' '}
          <code>styles/</code>, delete all the base CSS files in it and copy all
          the files from this framework. And after that happened, go to your{' '}
          <code>_app.tsx</code> file and add the following lines:
        </BodyMedium>

        <SyntaxHighlighter language='typescript' style={dracula}>
          {`/** @format */

import '@/styles/root.css';
import '@/styles/normalizer.css';
import '@/styles/generics.css';
import '@/styles/hover.css';
import '@/styles/focus.css';
import '@/styles/sm.css';
import '@/styles/md.css';
import '@/styles/lg.css';
import '@/styles/xl.css';
import '@/styles/xxl.css';
import '@/styles/custom.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}`}
        </SyntaxHighlighter>

        <BodyMedium>
          The order is really important. We need to import the{' '}
          <code>root.css</code> file first, then the <code>normalizer.css</code>{' '}
          file, and then the <code>generics.css</code>, <code>hovers.css</code>{' '}
          and <code>focus.css</code> files. After that, we can import the media
          queries files. The order is important because we need to override the
          styles from the previous files. So, if you want to override the styles
          from the <code>root.css</code> file, you need to import the{' '}
          <code>root.css</code> file first, and then other files.
        </BodyMedium>

        <BodyMedium>
          After that, you can use a <code>custon.css</code> file where you can
          add your own styles. This file will be imported after the{' '}
          <code>xxl.css</code> file. Because of inheritance, this file must be
          the latest to be imported.
        </BodyMedium>

        <BodyMedium>
          Once your setup, in your first view, you should see changes. Write a{' '}
          <code>DIV</code> element with a{' '}
          <code>className=&apos;border-dp&apos;</code> and you should see the
          framework in action:
        </BodyMedium>

        <div className='border-dp'>This is a bordered DIV element</div>
        <BodyMedium>
          Now you can start working on your project. But before writing the
          first lines of code, I advice you to inspect your designs and choose
          the right breakpoint strategy.
        </BodyMedium>
        <br />
        <br />

        <TitleLarge>Adding to an existing project</TitleLarge>

        <BodyMedium>
          This framework is agnostic. It means you don&apos;t need to use a
          specific framework or library to use it. And since it&apos;s pure CSS,
          you can use it with your current setup. Just make sure the imported
          files are over your current setup.
        </BodyMedium>

        <SyntaxHighlighter language='typescript' style={dracula}>
          {`/** @format */
import '@/styles/my-current-styles.css';
...
...
import '@/styles/root.css'; // make sure you don't repeat this one
import '@/styles/normalizer.css'; // make sure you don't repeat this one too
import '@/styles/generics.css';
import '@/styles/hovers.css';
import '@/styles/focus.css';
import '@/styles/sm.css';
import '@/styles/md.css';
import '@/styles/lg.css';
import '@/styles/xl.css';
import '@/styles/xxl.css';
import '@/styles/custom.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}`}
        </SyntaxHighlighter>

        <BodyMedium>
          Since our framework uses a specific naming convention, you can use it
          with your current setup pretty much without any problem.
        </BodyMedium>
      </Main>
    </>
  );
}
