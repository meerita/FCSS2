/** @format */
import Head from 'next/head';
import Link from 'next/link';
import DisplayLarge from '@/components/typography/DisplayLarge';
import Main from '@/components/documentation/main';
import BodyLarge from '@/components/typography/BodyLarge';
import BodyMedium from '@/components/typography/BodyMedium';
import BodySmall from '@/components/typography/BodySmall';
import HeadlineLarge from '@/components/typography/HeadlineLarge';

export default function Manifesto() {
  return (
    <>
      <Head>
        <title>The Functional CSS Framework (TFCSSF)</title>
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
        <DisplayLarge>We&apos;ve been doing CSS wrong all along.</DisplayLarge>
        <BodyLarge>
          We have been programming{' '}
          <abbr title='Cascading Style Sheets'>CSS</abbr> incorrectly for a long
          time. It&apos;s time to move forward. By using the Functional CSS
          Framework, the size of the CSS files is drastically reduced. The
          loading, rendering, and painting speed of websites are significantly
          increased. The projects also gain ease of maintenance and become
          easier to understand. Say goodbye to technical debt.
        </BodyLarge>
        <BodyMedium>
          When I started writing CSS in 1996, I was truly excited: the entire
          presentation of an HTML document could be defined on a separate file
          and, consequently, every change I wanted to make reverberated
          everywhere on the website I was maintaining. This, as it sounds, was a
          great deal for us developers. Not having to edit thousands of HTML
          files by hand, always repeating the same changes, was a blessing. But…
          we had a problem: back then, IE 3 was the first browser to support the
          fully CSS 1 standard, so the rest of the population were still using
          Netscape and, as you may suspect, people did not switch browsers at
          all like we do today. So, we developers had to stick to HTML editing
          until the majority of people switched or upgraded browsers. That was
          the reality around 1996.
        </BodyMedium>
        <BodyMedium>
          Developers were once concerned with the performance of their creations
          due to slow connections and less powerful computers. Each optimization
          made was a major win for the end user. We started using CSS to reduce
          HTML file sizes, created image sprites to avoid overwhelming the
          server, and implemented asset compression and caching, which seemed to
          work well. However, everything changed with the standardization of
          high-speed connections.
        </BodyMedium>
        <BodyMedium>
          Nowadays, the landscape has shifted. We enjoy faster connections,
          better computers, and a wide range of tools. Developers now prioritize
          working with automated tooling over generating slim CSS files and
          focusing on better architectures. The crazy optimizations we pursued
          in the past now feel irrelevant. Despite this, many aspects are still
          crucial, particularly when coding CSS, as it significantly impacts
          both browsing performance and the team&apos;s efficiency in developing
          and maintaining the code.
        </BodyMedium>
        <HeadlineLarge>We have created a monster</HeadlineLarge>
        <BodyMedium>
          We introduced two innovations in the world of CSS: CSS Frameworks and
          CSS Methodologies. CSS Frameworks were recognizable as a set of CSS
          files that provided a base visual style for the UI. One popular
          example is{' '}
          <a
            href='https://getbootstrap.com/'
            title='Bootstrap · The most popular HTML, CSS, and JS library in the world.'
          >
            Bootstrap
          </a>
          . By simply applying the relevant class, like .btn, to an HTML button
          element, you could achieve a nicely styled button on your website.
          While it appeared to be a fantastic idea, the reality was that most
          developers ended up modifying or adding new styles on top of these
          frameworks, which increased the overall file size of the website.
          Moreover, many users installed these frameworks only to utilize a
          fraction of the available visual styles, resulting in numerous unused
          classes that occupied unnecessary browser memory.
        </BodyMedium>
        <BodyMedium>
          On the other hand, CSS Methodologies were designed to assist
          developers in architecting their visual styles from scratch. They
          encouraged developers to adopt an Object-Oriented Programming (OOP)
          class-based approach, often utilizing preprocessors like{' '}
          <a href='https://sass-lang.com/' title='Sass: #teamSass'>
            Sass
          </a>{' '}
          or{' '}
          <a
            href='https://lesscss.org/'
            title='
  Getting started | Less.js
'
          >
            LESS
          </a>
          . These preprocessors enabled the generation of hundreds of classes
          through scripts or nested classes, which could then be compiled into a
          compressed CSS file. Although the Sass css files may have seemed
          simple and straightforward, the end result often proved otherwise. The
          excessive number of classes and complex styles sometimes made it
          challenging to manage and maintain the codebase effectively.
        </BodyMedium>
        <BodyMedium>
          However, this progress came with a new cost: the CSS files started to
          grow larger. Whereas before, CSS frameworks and methodologies already
          contributed to larger files, the introduction of tools like Webpack
          resulted in even bigger bundles due to the inclusion of CSS within the
          components. Consequently, the loading, rendering, and painting speeds
          of websites were significantly decreased. The increased file size
          adversely affects website performance, leading to longer loading times
          and slower user experiences.
        </BodyMedium>
        <BodyMedium>
          So, after many years of working with the traditional development
          mindset, in 2015, while working on a side project, I made a
          significant decision to use only single-class utility to build the
          grid system. I leveraged the CSS3 Grids specification for this
          purpose, and for the remaining parts of the project, I continued to
          adhere to BEM type classes. However, when I started rewriting the
          project with improved React components, I had an epiphany moment where
          I began embracing and using more single classes.
        </BodyMedium>
        <BodyMedium>
          I soon realized that this approach was much better. I compared version
          1, which used a mix of utility classes and BEM, with the rewritten
          version that solely utilized utility classes. Surprisingly, the CSS
          file was much smaller, only 3KB, yet it achieved the same results. But
          what amazed me even more was the significant difference in
          performance. Version 1 rendered fast as usual, but version 2 rendered
          around 400% faster. The loading, rendering, and painting tasks were
          noticeably smaller. For example, while version 1 loaded all the CSS
          files in 43ms, the one using Functional CSS loaded in just 4ms.
          Similarly, if version 1 took 102ms to render everything, version 2
          only took 16ms. This drastic improvement eliminated all the white
          screen splashes, and the overall memory usage of the app and
          re-renderings were significantly reduced.
        </BodyMedium>
        <BodyMedium>
          Not only that, but months later, when I returned to work on the
          project again, I was pleasantly surprised to find that I could start
          working right away without worrying about the CSS architecture. This
          is another great advantage of working with a functional programming
          approach; it is easier to extend, modify, and work around. There is no
          need to memorize the entire project model to keep working efficiently.
          This newfound ease of working with a functional CSS approach allowed
          me to focus more on implementing new features and making improvements,
          rather than being bogged down by complex CSS structures. It made the
          development process smoother and more enjoyable.
        </BodyMedium>
        <BodyMedium>
          So, after 5 years of working with the functional CSS approach, I
          started a new project that brings the best of the Functional CSS
          world.
        </BodyMedium>
      </Main>
    </>
  );
}
