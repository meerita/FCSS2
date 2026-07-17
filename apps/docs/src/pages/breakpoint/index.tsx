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
import ListItem from '@/components/documentation/listItem/ListItem';
import BreakpointIndicator from '@/components/indicator/BreakPointIndicator';

export default function Breakpoints() {
  return (
    <>
      <Head>
        <title>
          The Breakpoints Support Strategy - The Functional CSS Framework
          (TFCSSF)
        </title>
        <meta
          name='description'
          content='FCSSF (The Functional CSS Framework) is a versatile and lightweight functional CSS framework that simplifies the process of styling web applications. This repository contains the core FCSSF CSS files, a Next.js documentation application, and some basic React components. '
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <BreakpointIndicator />
      <Main>
        <BodySmall>
          <Link href='/'>Home</Link>
        </BodySmall>
        <DisplayLarge>The Breakpoints Support Strategy</DisplayLarge>
        <BodyLarge>
          Before starting your project, you need to define the breakpoints you
          will use. The breakpoints are the points where the layout of your web
          application will change. TFCSSF supports several breakpoints, from
          generics (all devices) to mobile, tablet, desktop, and widescreen.
        </BodyLarge>
        <TitleLarge>First, check your designs</TitleLarge>
        <BodyMedium>
          The first step is to check your designs and identify the breakpoints
          needs. Most designs requiere only two breakpoints: mobile and desktop.
          But some other designs requiere tablet, widescreen, and other
          breakpoints. Here is a list of the most common strategies for
          breakpoints and this framework:
        </BodyMedium>

        <ul>
          <ListItem>
            <strong className='color--black font-weight--500'>
              No need to support mobile:
            </strong>{' '}
            use only the <code>generics.css</code> classes for your project.
            Remove <code>sm.css</code>, and <code>md.css</code>,{' '}
            <code>lg.css</code> files.
          </ListItem>
          <ListItem>
            <strong className='color--black font-weight--500'>
              Mobile and desktop:
            </strong>{' '}
            use the <code>generics.css</code> for when you have the requirement
            on all devices, and the <code>sm.css</code> for specific mobile
            rules (ex. <code>.sm-display--block</code>) and <code>md.css</code>{' '}
            for specific CSS rules (ex.
            <code>.md-display--flex</code>).
          </ListItem>
          <ListItem>
            <strong className='color--black font-weight--500'>
              Mobile, tablet, and desktop:
            </strong>{' '}
            use the <code>generics.css</code> for when you have the requirement
            on all devices, and the <code>sm.css</code> for mobile rules (ex.{' '}
            <code>.sm-display--block</code>), <code>md.css</code> for tablet
            rules (ex. <code>.md-display--flex</code>), and <code>lg.css</code>{' '}
            for desktop all desktop rules.
          </ListItem>
          <ListItem>
            <strong className='color--black font-weight--500'>
              Mobile, tablet, desktop, and widescreen:
            </strong>{' '}
            use the <code>generics.css</code> for when you have the requirement
            on all devices, and the <code>sm.css</code> for mobile rules (ex.{' '}
            <code>.sm-display--block</code>), <code>md.css</code> for tablet
            rules (ex. <code>.md-display--flex</code>), <code>lg.css</code> for
            desktop rules (ex. <code>.lg-display--flex</code>), and{' '}
            <code>xl.css</code> for widescreen rules (ex.{' '}
            <code>.xl-display--flex</code>).
          </ListItem>
        </ul>
        <TitleLarge>Breakpoint scales</TitleLarge>
        <BodyMedium>
          The framework supports several breakpoints. From start, breakpoints
          only work if you specify the modifier <code>--sm</code>,
          <code>--md</code>, <code>--lg</code>, <code>--xl</code>, or{' '}
          <code>--xxl</code>. Unless you are usign these, then you will have
          true effect when resizing the screen. Otherwise, you will be applying
          mostly generic classes.
        </BodyMedium>

        <table className='width--100 border-collapse--collapse border-dp text-align--left'>
          <thead>
            <tr className='border-dp'>
              <th className='padding--8'>Condition</th>
              <th className='padding--8'>Mobile</th>
              <th className='padding--8'>Tablets</th>
              <th className='padding--8'>Desktop (Small)</th>
              <th className='padding--8'>Desktop (Laptop)</th>
              <th className='padding--8'>Desktop (Widescreen)</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-dp'>
              <td className='padding--8'>
                <BodySmall inline>Extension</BodySmall>
              </td>
              <td className='padding--8'>
                <code>sm-</code>
              </td>
              <td className='padding--8'>
                <code>md-</code>
              </td>
              <td className='padding--8'>
                <code>lg-</code>
              </td>
              <td className='padding--8'>
                <code>xl-</code>
              </td>
              <td className='padding--8'>
                <code>xxl-</code>
              </td>
            </tr>
            <tr className='border-dp'>
              <td className='padding--8'>
                <code>min-width</code>
              </td>
              <td></td>
              <td className='padding--8'>
                <BodySmall inline>+768px</BodySmall>
              </td>
              <td className='padding--8'>
                <BodySmall inline>+992px</BodySmall>
              </td>
              <td className='padding--8'>
                <BodySmall inline>+1200px</BodySmall>
              </td>
              <td className='padding--8'>
                <BodySmall inline>+1400px</BodySmall>
              </td>
            </tr>
            <tr className='border-dp'>
              <td className='padding--8'>
                <code>max-width</code>
              </td>
              <td className='padding--8'>
                <BodySmall inline>-576px</BodySmall>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <BodyMedium>
          Most projects will only need the <code>generics.css</code> file along
          with the <code>sm.css</code> and <code>md.css</code> files. But if you
          need more breakpoints, you can add the files you need.
        </BodyMedium>

        <BodyMedium>
          If you only need one design, you don&apos;t need to use breakpoints,
          everything it is supported by the <code>generics.css</code> rules. The
          generic rules work accross all the breakpoints. The rules are
          breakpoint agnostic. An example rule is:
        </BodyMedium>

        <TitleLarge>Find out which breakpoint you&apos;re watching</TitleLarge>

        <BodyMedium>
          The <code>BreakpointIndicator</code> component (React only) is really
          useful when you are building grids and layouts or working in anything
          else. It will display the current breakpoint you are watching and tell
          you the exact modifier: <code>--sm</code>, <code>--md</code>,{' '}
          <code>--lg</code>, <code>--xl</code>, or <code>--xxl</code>.
        </BodyMedium>
        <SyntaxHighlighter language='jsx' style={dracula}>
          {`export default function Home(props) {
  return (
    <>
      <BreakpointIndicator />
    </>
    );
}`}
        </SyntaxHighlighter>
        <br />
        <br />
      </Main>
    </>
  );
}
