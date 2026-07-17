/** @format */

import IStylesProps from '@/interfaces/IStylesProps';
import BodyMedium from '../typography/BodyMedium';

export default function BreakpointIndicator(props: IStylesProps) {
  return (
    <>
      <BodyMedium className='position--fixed border-dp md-display--none margin--0'>
        --device-sm: 576px;
      </BodyMedium>
      <BodyMedium className='position--fixed border-dp sm-display--none lg-display--none xxl-display--none md-display--block margin--0'>
        --device-md: 768px;
      </BodyMedium>
      <BodyMedium className='position--fixed border-dp sm-display--none md-display--none xl-display--none xxl-display--none lg-display--block margin--0'>
        --device-lg: 992px;
      </BodyMedium>
      <BodyMedium className='position--fixed border-dp sm-display--none md-display--none lg-display--none xxl-display--none xl-display--block margin--0'>
        --device-xl: 1200px;
      </BodyMedium>
      <BodyMedium className='position--fixed border-dp sm-display--none md-display--none lg-display--none xl-display--none xxl-display--block margin--0'>
        --device-xxl: 1400px;
      </BodyMedium>
    </>
  );
}
