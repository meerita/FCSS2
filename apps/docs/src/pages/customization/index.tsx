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
import HeadlineLarge from '@/components/typography/HeadlineLarge';

export default function Customization() {
  return (
    <>
      <Head>
        <title>Customization - The Functional CSS Framework (TFCSSF)</title>
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
        <DisplayLarge>Customization</DisplayLarge>
        <BodyLarge>
          Sometimes, an utility class doesn&apos;t fit your needs. In this case,
          you need to create a custom class. This guide will show you how to
          create a custom class. This means you can have the best of the both
          worlds: the simplicity of utility classes and the flexibility of
          custom classes.
        </BodyLarge>
        <BodyMedium>
          When you load the CSS files, you will notice that there is precedence
          by inheritance in the CSS files. For example, the classes on{' '}
          <code>generics.css</code> will have precedence each other following
          the order:
        </BodyMedium>
        <SyntaxHighlighter language='css' style={dracula}>
          {`/** In generics.css */        
.color--black {
  color: black;
}
.color--white {
  color: white;
}
`}
        </SyntaxHighlighter>

        <BodyMedium>
          Now, in the HTML, you can use the classes like this:
        </BodyMedium>

        <SyntaxHighlighter language='html' style={dracula}>
          {`<p class="color--black">This text is black</p>
<p class="color--white">This text is white</p>`}
        </SyntaxHighlighter>

        <BodyMedium>This code outputs:</BodyMedium>

        <div className='border-dp'>
          <p className='color--black'>This text is black</p>
          <p className='color--white'>This text is white</p>
        </div>

        <BodyMedium>
          This works beautifully, but what if you want to make the paragraph
          with white color black overwriting? Something like this:
        </BodyMedium>

        <SyntaxHighlighter language='html' style={dracula}>
          {`<p class="color--black">This text is black</p>
<p class="color--white color--black">This text is white</p>`}
        </SyntaxHighlighter>

        <BodyMedium>
          Even though you added the <code>color--black</code> class after the{' '}
          <code>color--white</code> class, the paragraph is still white. You
          thought that the <code>color--black</code> class would overwrite the{' '}
          <code>color--white</code> class because you wrote it in different
          order, but it didn&apos;t. The browser still applies the{' '}
          <code>color--white</code> class. Why?
        </BodyMedium>
        <BodyMedium>
          This is because the <code>color--white</code> class has precedence
          over the <code>color--black</code> class because it is declared after
          the <code>color--black</code> class in the CSS, therefore the
          paragraph will be white because of the natural inheritance order
          dictacted by the CSS.
        </BodyMedium>
        <BodyMedium>
          To address this issue, you can introduce the <code>!important</code>
          keyword to the <code>color--black</code> class. However, doing so will
          result in the same output as the previous code, albeit causing
          significant disruption to your CSS structure. This approach would
          demand the inclusion of the <code>!important</code> keyword across all
          instances, ultimately leading to a cluttered CSS file and the
          persistence of this recurring problem.
        </BodyMedium>
        <BodyMedium>
          FCSS resolves this dilemma by employing custom classes documented
          within the <code>custom.css</code> file, which is intentionally
          imported as the final step. Although this practice deviates from the
          standard FCSS methodology, it remains a viable option for
          implementation when necessary.
        </BodyMedium>
        <BodyMedium>
          If you need to solve an inheritance problem, make a logic case in the
          component for rendering a different class. For example, if you need to
          render a black text instead of white, you can do something like this:
        </BodyMedium>

        <SyntaxHighlighter language='jsx' style={dracula}>
          {`/** @format */

export default function MyComponent({ color }) {
  const textColor = color === 'black' ? 'black' : 'white';
  return (
    <p className={\`color--\${textColor}\`}>
      This text is {color}
    </p>
  );
  }
          `}
        </SyntaxHighlighter>

        <BodyMedium>
          This a clean way to solve it. But for other cases, you cannot use
          this, and for those cases, you may want to write your custom class.
        </BodyMedium>

        <TitleLarge>Writing a custom class</TitleLarge>

        <BodyMedium>
          To write a custom class, you need to write it in the{' '}
          <code>custom.css</code> this file is always imported last, so it will
          have precedence over the other classes. It must follow a defined
          pattern, the pattern I designed is all custom classes must be preceded
          by a preffix <code>.c-</code>. For example, if you want to create a
          class that makes the text red on hover, you can do something like
          this:
        </BodyMedium>

        <SyntaxHighlighter language='css' style={dracula}>
          {`/** In custom.css */
.c-color-red-on-hover:hover {
  color: red;
}`}
        </SyntaxHighlighter>

        <BodyMedium>
          Now, in the HTML, you can use the class like this:
        </BodyMedium>

        <SyntaxHighlighter language='html' style={dracula}>
          {`<p class="color--black c-color-red-on-hover">This text is red on hover</p>`}
        </SyntaxHighlighter>

        <BodyMedium>This code outputs the following result:</BodyMedium>

        <div className='border-dp'>
          <p className='color--black c-color-red-on-hover'>
            This text is red on hover
          </p>
        </div>

        <BodyMedium>
          You must be careful when writing custom classes. You must avoid
          classes with dozens of properties, because this will make your CSS
          file huge. You must also avoid classes that are too specific, because
          this will make your CSS file too specific and will make it hard to
          maintain. Always try to make your classes reusable. Always use{' '}
          <code>c-</code> preffix for custom classes, this will make it easier
          to identify them.
        </BodyMedium>
        <BodyMedium>
          If your project has too many classes, something is wrong. Ideally, you
          will have a few classes, and you will reuse them across your project.
          If you have too many classes, you may want to rethink your design.
        </BodyMedium>
      </Main>
    </>
  );
}
