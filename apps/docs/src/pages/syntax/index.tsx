/** @format */
import Head from 'next/head';
import Link from 'next/link';
import DisplayLarge from '@/components/typography/DisplayLarge';
import Main from '@/components/documentation/main';
import BodyLarge from '@/components/typography/BodyLarge';
import BodyMedium from '@/components/typography/BodyMedium';
import BodySmall from '@/components/typography/BodySmall';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Syntax() {
  return (
    <>
      <Head>
        <title>Syntax - The Functional CSS Framework (TFCSSF)</title>
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
        <DisplayLarge>The natural FCSS syntax</DisplayLarge>
        <BodyLarge>
          Writing Functional CSS using other frameworks is possible, but the
          learning curve can be steep. The syntax is often unnatural and hard to
          remember. FCSS, however, is different. Its syntax is natural and easy
          to remember. This guide will show you how to write Functional CSS
          using FCSS.
        </BodyLarge>
        <BodyMedium>
          The first rule of FCSS is that a class must be written as it appears
          in CSS. For example, if you want to create a class that makes the text
          black, you can do something like this:
        </BodyMedium>
        <SyntaxHighlighter language='css' style={dracula}>
          {`/** In generics.css */        
.color--black {
  color: black;
}
`}
        </SyntaxHighlighter>
        <BodyMedium>
          The basic structure is <code>[property]--[value]</code>. For example,
          in <code>color--black</code>, color is the property and black is the
          value. This mirrors the natural way to write CSS, making it easy to
          remember. You can start imagining how other classes are written:{' '}
          <code>display--block</code>, <code>height--100</code>, etc. When a
          property has multiple words, use a dash as you would in CSS. For
          example, to represent the background color property, you can write{' '}
          <code>background-color--black</code>. This approach is straightforward
          and consistent. The same rule applies to values: if a value has
          multiple words, use a dash, just as in CSS. For example, to apply{' '}
          <code>display: inline-block</code>, you can write{' '}
          <code>display--inline-block</code>.
        </BodyMedium>
        <BodyMedium>
          The second rule of FCSS is that a class may be preceded by a prefix.
          Prefixes are used to group classes for breakpoints or custom classes.
          For example, <code>sm-display--block</code> is equivalent to this:
        </BodyMedium>

        <SyntaxHighlighter language='css' style={dracula}>
          {`/** In sm.css */
@media (max-width: 640px) {
  .sm-display--block {
    display: block;
  }
}`}
        </SyntaxHighlighter>
        <BodyMedium>
          In the FCSS framework you can find many breakpoint premade prefixes:{' '}
          <code>sm-</code>,<code>md-</code>, <code>lg-</code>, <code>xl-</code>,{' '}
          <code>xxl-</code>, etc., and you can also read about the breakpoint
          strategy in the <Link href='/breakpoint'>breakpoint page</Link>.
        </BodyMedium>
        <BodyMedium>
          Sometimes, you will find yourself in a situation where you need to add
          a custom class. For example, if you want to add a class that makes the
          text uppercase, you need to use the prefix <code>c-</code>. All rules
          that begin with <code>c-</code> are custom classes, and these classes
          must be added to <code>custom.css</code>. To learn more about custom
          classes, you can read the{' '}
          <Link href='/customization'>customization page</Link>.
        </BodyMedium>
        <BodyMedium>
          In other situations, you will find yourself that you need to add
          sufixes to a class. Sufixes are used to add behavior properties to a
          class. For example, we can add the hover behavior to the{' '}
          <code>color--</code> property: <code>color--black:hover</code>. In
          code this looks like:
        </BodyMedium>
        <SyntaxHighlighter language='css' style={dracula}>
          {`/** In generics.css */  
.color--green\\:hover:hover {
  color: var(--green);
}`}
        </SyntaxHighlighter>
        <SyntaxHighlighter language='jsx' style={dracula}>
          {`<BodyMedium className='color--green:hover'>Hover me to see the effect.</BodyMedium>`}
        </SyntaxHighlighter>
        <BodyMedium className='color--green:hover'>
          Hover me to see the effect.
        </BodyMedium>
      </Main>
    </>
  );
}
