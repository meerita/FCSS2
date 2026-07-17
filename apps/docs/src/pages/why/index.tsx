/** @format */
import Head from 'next/head';
import Link from 'next/link';
import DisplayLarge from '@/components/typography/DisplayLarge';
import Main from '@/components/documentation/main';
import BodyLarge from '@/components/typography/BodyLarge';
import BodyMedium from '@/components/typography/BodyMedium';
import BodySmall from '@/components/typography/BodySmall';
import TitleLarge from '@/components/typography/TitleLarge';
import Image from 'next/image';

export default function Why() {
  return (
    <>
      <Head>
        <title>
          Why Functional CSS is important - The Functional CSS Framework
          (TFCSSF)
        </title>
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
        <DisplayLarge>Why Functional CSS is important</DisplayLarge>
        <BodyLarge>
          Functional CSS, a relatively new concept in the frontend development
          world, faces opposition from some developers. However, this resistance
          could stem from a lack of full understanding regarding its advantages
          and its potential to enhance their code. In this article, I will
          elucidate several arguments in defense of Functional CSS and expound
          on why it might serve as a superior methodology for most projects.
        </BodyLarge>
        <BodyMedium>
          In the frontend development world, two recent trends have garnered
          significant attention and debate: Object Oriented vs Functional
          Programming. On one side, there are proponents of programming with
          structural annotations encoded in string names like BEM (Block Element
          Modifier) and object-oriented approaches. On the other side, there are
          advocates of Functional CSS, which employs a single-class utility
          approach to development. Each of these methodologies comes with{' '}
          <i>its own set of advantages and disadvantages</i>. However, when
          analyzing and comparing them, many articles tend to overlook making a
          fair analysis of Functional CSS. This leaves the impression that the
          current popular way of writing CSS is the only effective approach,
          which may not be the case.
        </BodyMedium>
        <BodyMedium>
          When developers ask me about the benefits of functional CSS, the
          answer is simple: it offers a streamlined approach without the need to
          build a complex architecture, resulting in an ultra-performant
          application. Functional CSS has several advantages over other
          object-oriented methodologies. For instance, it annihilates technical
          debt. Unlike creating numerous classes with inheritance, nesting, and
          other complexities, functional CSS keeps things clean and
          straightforward. With traditional OOP-style CSS, projects can quickly
          become disorganized, making it challenging to choose the appropriate
          class for a specific task. This often leads to the creation of
          additional classes to avoid conflicts, making the codebase more
          convoluted. Another drawback is the reliance on inheritance, which
          often leads to the excessive use of !important statements. As a class
          is utilized across the application, there is a higher chance of
          creating new classes to override previous ones, resulting in an
          undesirable cascade of !important declarations. Functional CSS
          mitigates these issues and promotes a more maintainable and efficient
          codebase.
        </BodyMedium>
        <BodyMedium>
          Functional CSS is a coding approach that emphasizes minimal and
          efficient code usage. It eliminates the repetition of properties and
          promotes code reusability. In contrast, Object-Oriented Programming
          (OOP) often leads to code repetition and difficulty in reusing code,
          resulting in the creation of numerous classes.{' '}
          <a
            href='https://www.minid.net/2019/4/7/the-css-utilitarian-methodology'
            title='The Utilitarian CSS Methodology'
          >
            The research I conducted
          </a>{' '}
          to support this argument shows that major websites experience a yearly
          increase in CSS size. While it may be tempting to reuse classes,
          developers frequently create new ones to prevent conflicts. In
          contrast, FCSS allows developers to focus on building without worrying
          about conflicts and encourages a more straightforward development
          process. It promotes a pure and efficient form of coding, recycling
          code and avoiding unnecessary duplication.
        </BodyMedium>

        <TitleLarge>Real performance</TitleLarge>

        <BodyMedium>
          In the image below, you can see the four stages of performance tasks
          that you can do on a website. Most frontend developers only focus on
          the 3rd one (Resources). It&apos;s commendable that they care about
          these topics, but often, the majority of developers aren&apos;t aware
          of the 4th stage of optimizations (Rendering). During this stage, you
          can make various modifications to your code to increase your
          website&apos;s speed. This is where FCSS shines.
        </BodyMedium>

        <Image
          src='/performance.svg'
          alt='Performance'
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            maxWidth: '80%',
            marginInline: 'auto',
          }}
          width={640}
          height={480}
        />

        <BodyMedium>
          As a general rule, any request to the server can delay the compilation
          of a website. Since HTML is the first document served and processed by
          the browser, inline CSS (or styles in the HEAD) can be faster in
          performance than serving external CSS files. However, in some cases,
          inline CSS is not feasible or does not scale as needed, and external
          CSS files with caching rules are used instead. Without proper caching,
          the page may display a white screen for a few seconds while the
          browser waits for the CSS to be processed into a CSSOM. Therefore,
          delivering the CSS file to the browser as quickly as possible is
          essential for faster page rendering.
        </BodyMedium>
        <BodyMedium>
          Functional CSS offers a faster and more efficient way to develop CSS.
          The purged files using the FCSS framework are typically small enough
          to be placed in the HEAD section of the H TML document, rather than
          being served through external CSS files. Even if an external file is
          used, FCSS will still deliver the CSS to the browser more quickly than
          conventional CSS development methods. Most FCSS files are less than
          5KB in size when uncompressed, making them incredibly lightweight and
          efficient.
        </BodyMedium>
        <BodyMedium>
          One frequently ignored aspect of web development is resource loading
          in the browser, which refers to how much time it takes for the browser
          to understand the HTML, JS, CSS, and other resources provided by the
          server. While this time is typically measured in milliseconds, it can
          sometimes exceed a second, causing the browser to become stuck and
          unable to render or paint the webpage.
        </BodyMedium>
        <BodyMedium>
          CSS files with excessive selectors and properties can significantly
          slow down loading times. Due to the nature of methodologies such as
          BEM, CSS files can end up with an overwhelming number of rules,
          sometimes exceeding 9,000 or even more, as previously mentioned. This
          adds extra time to load and process the CSS, further delaying the
          rendering process.
        </BodyMedium>
        <BodyMedium>
          The last and most important point to mention in this performance
          section is rendering time. Once the browser has built the CSSOM (in
          the loading job), the rendering instructions begins its job to deliver
          the painting process. Lots of things can affect the rendering time:
          Javascript code, Webfonts, CSS effects (like box-shadow, filters,
          background images, fonts, etc.) amount of resources to load, slow
          selectors and pseudo selectors, etc. Functional CSS approach
          outperforms any other methodology: it is so explicit that render times
          are greatly improved. In all tests with different projects in
          complexity, I&apos;ve got performance gains from an average of 175ms
          to a mere 17ms. That&apos;s insanely fast. This is given because of
          the explicit nature of the single class CSS and the lack of all the
          rules in play at that moment. In a test in the lab, we have found that
          even un-styled pages aren&apos;t that faster than the same HTML styled
          with FCSS due the nature of the CSS provided on the default
          browser&apos;s CSS stylesheets. So amazing as that.
        </BodyMedium>
      </Main>
    </>
  );
}
