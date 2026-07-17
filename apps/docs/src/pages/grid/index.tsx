/** @format */
import Head from 'next/head';
import Link from 'next/link';
import DisplaySmall from '@/components/typography/DisplaySmall';
import HeadlineSmall from '@/components/typography/HeadlineSmall';
import ListItem from '@/components/documentation/listItem/ListItem';
import Main from '@/components/documentation/main';
import BodyLarge from '@/components/typography/BodyLarge';
import BodyMedium from '@/components/typography/BodyMedium';
import BodySmall from '@/components/typography/BodySmall';
import TitleLarge from '@/components/typography/TitleLarge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import HeadlineLarge from '@/components/typography/HeadlineLarge';
import DisplayLarge from '@/components/typography/DisplayLarge';

export default function Customization() {
  return (
    <>
      <Head>
        <title>The grid system - The Functional CSS Framework (TFCSSF)</title>
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
        <DisplayLarge>The Grid System</DisplayLarge>
        <BodyLarge>
          The functional CSS grid system is based on the CSS Grid Layout Module.
          You can build any kind of layout even easier than with other
          frameworks because the Functional CSS framework uses the same naming
          convention as the CSS Grid Layout Module, and it works in
          mobile-first.
        </BodyLarge>
        <BodyMedium>
          The ideal way to use the grid system is to use the foundation classes
          and extend it if you need more columns or rows. Most of the time, you
          will need no more than 12 columns and 12 rows. The metric system used
          is multiple of 4, meaning that you can have 4, 8, 12, 16, 20, 24, 28,
          32, 36, 40, and 44 as spaces between columns and rows. The grid system
          works generically, meaning that you can use it in any breakpoint, but
          you can specify different rows and columns number based on the
          breakpoint you want to target.
        </BodyMedium>
        <HeadlineSmall>Grid properties</HeadlineSmall>
        <BodyMedium>
          In order to get started with the grid system, you need to define{' '}
          <code>display--grid</code> or <code>display--inline-grid</code> (if
          you want to make it for all breakpoints) on the parent element. Then,
          you can use the following properties:
        </BodyMedium>
        <BodyMedium>Properties for the Parent (Grid Container)</BodyMedium>
        <ul>
          <ListItem>
            <code>justify-items--</code>
          </ListItem>
          <ListItem>
            <code>auto-columns--</code>
          </ListItem>
          <ListItem>
            <code>align-items--</code>
          </ListItem>
          <ListItem>
            <code>align-content--</code>
          </ListItem>
          <ListItem>
            <code>place-items--</code>
          </ListItem>
          <ListItem>
            <code>justify-content--</code>
          </ListItem>
          <ListItem>
            <code>template-columns--</code>
          </ListItem>
          <ListItem>
            <code>template-rows--</code>
          </ListItem>
          <ListItem>
            <code>column--</code>
          </ListItem>
          <ListItem>
            <code>row--</code>
          </ListItem>
          <ListItem>
            <code>column-gap--</code>
          </ListItem>
          <ListItem>
            <code>row-gap--</code>
          </ListItem>
          <ListItem>
            <code>gap--</code>
          </ListItem>
        </ul>
        <BodyMedium>Properties for the children (grid items)</BodyMedium>
        <ul>
          <ListItem>
            <code>column-start--</code>
          </ListItem>
          <ListItem>
            <code>column-end--</code>
          </ListItem>
          <ListItem>
            <code>row-start--</code>
          </ListItem>
          <ListItem>
            <code>row-end--</code>
          </ListItem>
          <ListItem>
            <code>justify-self--</code>
          </ListItem>
          <ListItem>
            <code>align-self--</code>
          </ListItem>
        </ul>
        <br />
        <br />
        <TitleLarge>Examples</TitleLarge>
        <BodyMedium>
          Let&apos;s start by building a simple grid with 12 columns:
        </BodyMedium>
        <SyntaxHighlighter language='html' style={dracula}>
          {`<div className="display--grid template-columns--12">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
  <div>10</div>
  <div>11</div>
  <div>12</div>
</div>`}
        </SyntaxHighlighter>

        <BodyMedium>
          The code above will create a grid with 12 columns for all devices,
          this may not look good in mobile when tested, but do not worry, we can
          build grids for any device with ease. The grid that will be output
          (don&apos;t mind the <code>border-dp</code>, the{' '}
          <code>padding--4</code> and the <code>text-align--center</code>{' '}
          classes, they are just for the example) will be like this:
        </BodyMedium>
        <div className='border-dp display--grid template-columns--12 text-align--center'>
          <div className='border-dp padding--4'>1</div>
          <div className='border-dp padding--4'>2</div>
          <div className='border-dp padding--4'>3</div>
          <div className='border-dp padding--4'>4</div>
          <div className='border-dp padding--4'>5</div>
          <div className='border-dp padding--4'>6</div>
          <div className='border-dp padding--4'>7</div>
          <div className='border-dp padding--4'>8</div>
          <div className='border-dp padding--4'>9</div>
          <div className='border-dp padding--4'>10</div>
          <div className='border-dp padding--4'>11</div>
          <div className='border-dp padding--4'>12</div>
        </div>
        <BodyMedium>
          As you see, the grid created 12 columns for all devices, equally
          spaced, and no gap. We can change the number of columns and add gaps
          between. In this example, we reduce the number of columns to 6 and add
          a gap of <code>8px</code> between them:
        </BodyMedium>
        <SyntaxHighlighter language='html' style={dracula}>
          {`<div className="display--grid gap--8 template-columns--6">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
  <div>10</div>
  <div>11</div>
  <div>12</div>
</div>`}
        </SyntaxHighlighter>
        <BodyMedium>
          The code above will create a grid with 12 columns for all devices,
          this may not look good in mobile when tested, but do not worry, we can
          build grids for any device with ease. The grid that will be output
          (don&apos;t mind the <code>border-dp</code>, the{' '}
          <code>padding--4</code> and the <code>text-align--center</code>{' '}
          classes, they are just for the example) will be like this:
        </BodyMedium>
        <div className='border-dp display--grid gap--8 template-columns--6 text-align--center'>
          <div className='border-dp padding--4'>1</div>
          <div className='border-dp padding--4'>2</div>
          <div className='border-dp padding--4'>3</div>
          <div className='border-dp padding--4'>4</div>
          <div className='border-dp padding--4'>5</div>
          <div className='border-dp padding--4'>6</div>
          <div className='border-dp padding--4'>7</div>
          <div className='border-dp padding--4'>8</div>
          <div className='border-dp padding--4'>9</div>
          <div className='border-dp padding--4'>10</div>
          <div className='border-dp padding--4'>11</div>
          <div className='border-dp padding--4'>12</div>
        </div>
        <br />
        <br />
        <TitleLarge>Responsive Grids</TitleLarge>
        <BodyMedium>
          To create a responsive grid, you need to add the <code>sm--</code>,{' '}
          <code>md--</code>, <code>lg--</code>, <code>xl--</code> or{' '}
          <code>xxl--</code>, and the property you want to change. For example,
          if you want to change the number of columns in mobile to 2, on iPad
          vertical, horizontal to 3, and small desktop to 5, and bigger screens
          to 7 and huge screens to 12 you can do the following code:
        </BodyMedium>
        <SyntaxHighlighter language='html' style={dracula}>
          {`<div className="display--grid gap--8 sm-template-columns--2 md-template-columns--3 lg-template-columns--5 xl-template-columns-7 xxl-template-columns--12">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
  <div>10</div>
  <div>11</div>
  <div>12</div>
</div>`}
        </SyntaxHighlighter>

        <BodyMedium>
          And the output will be like this (resize your browser to see the
          effect):
        </BodyMedium>

        <div className='border-dp display--grid sm-template-columns--2 md-template-columns--3 lg-template-columns--5 xl-template-columns--7 xxl-template-columns--12 gap--8 template-columns--6 text-align--center'>
          <div className='border-dp padding--4'>1</div>
          <div className='border-dp padding--4'>2</div>
          <div className='border-dp padding--4'>3</div>
          <div className='border-dp padding--4'>4</div>
          <div className='border-dp padding--4'>5</div>
          <div className='border-dp padding--4'>6</div>
          <div className='border-dp padding--4'>7</div>
          <div className='border-dp padding--4'>8</div>
          <div className='border-dp padding--4'>9</div>
          <div className='border-dp padding--4'>10</div>
          <div className='border-dp padding--4'>11</div>
          <div className='border-dp padding--4'>12</div>
        </div>
        <br />
        <br />
        <BodyMedium>
          Imagine the possibilities, you can create a grid for any device with
          ease. You can create millions of combinations for layouts and even for
          children items.
        </BodyMedium>
        <BodyMedium>
          You can also define the gap between columns and rows separately, but
          more importantly, the different gaps between devices. For example, the
          gap of the previous grid layout in mobile will be <code>4px</code>, in
          medium devices will be <code>8px</code>, in large screens{' '}
          <code>12px</code>, in bigger screens <code>16px</code> and in huge
          screens <code>32px</code>. To do this, you can use the following
          classes:
        </BodyMedium>
        <SyntaxHighlighter language='html' style={dracula}>
          {`<div className="display--grid sm-gap--4 md-gap--8 lg-gap--12 xl-gap--16 xxl-gap--32 sm-template-columns--2 md-template-columns--3 lg-template-columns--5 xl-template-columns--7 xxl-template-columns--12">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
  <div>10</div>
  <div>11</div>
  <div>12</div>
</div>`}
        </SyntaxHighlighter>
        <BodyMedium>
          And the output will be like this (resize your browser to see the
          effect and check the gaps):
        </BodyMedium>
        <div className='border-dp display--grid sm-gap--4 md-gap--8 lg-gap--12 xl-gap--16 xxl-gap--32 sm-template-columns--2 md-template-columns--3 lg-template-columns--5 xl-template-columns--7 xxl-template-columns--12 text-align--center'>
          <div className='border-dp padding--4'>1</div>
          <div className='border-dp padding--4'>2</div>
          <div className='border-dp padding--4'>3</div>
          <div className='border-dp padding--4'>4</div>
          <div className='border-dp padding--4'>5</div>
          <div className='border-dp padding--4'>6</div>
          <div className='border-dp padding--4'>7</div>
          <div className='border-dp padding--4'>8</div>
          <div className='border-dp padding--4'>9</div>
          <div className='border-dp padding--4'>10</div>
          <div className='border-dp padding--4'>11</div>
          <div className='border-dp padding--4'>12</div>
        </div>
        <BodyMedium>
          Normally, you will not need that much flexibility, with gaps, but it
          is a nice feature to have and same with the rest of the properties.
          The most common use is switching columns between devices.
        </BodyMedium>
      </Main>
    </>
  );
}
