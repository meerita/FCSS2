/** @format */

import IReactElement from '@/interfaces/IReactElement';

export default function Main(props: IReactElement): JSX.Element {
  return (
    <main className='sm-padding--16 md-padding--32 lg-padding--64'>
      {props.children}
    </main>
  );
}
