import { getGasLoadingAnimationIsShowing } from '@reducer/app';
import { useShouldAnimateGasEstimations } from '@view/hooks/useShouldAnimateGasEstimations';
import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

const BASE_CLASS = 'loading-heartbeat';
const LOADING_CLASS = `${BASE_CLASS}--active`;

export default function LoadingHeartBeat() {
  useShouldAnimateGasEstimations();
  const active = useSelector(getGasLoadingAnimationIsShowing);

  return (
    <div
      className={classNames('loading-heartbeat', {
        [LOADING_CLASS]: active,
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    ></div>
  );
}
