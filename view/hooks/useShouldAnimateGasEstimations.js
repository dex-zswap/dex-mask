import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import {
  getGasLoadingAnimationIsShowing,
  toggleGasLoadingAnimation,
} from '@reducer/app';
import { useGasFeeEstimates } from './useGasFeeEstimates';
export function useShouldAnimateGasEstimations() {
  const { isGasEstimatesLoading, gasFeeEstimates } = useGasFeeEstimates();
  const dispatch = useDispatch();
  const isGasLoadingAnimationActive = useSelector(
    getGasLoadingAnimationIsShowing,
  ); // Do the animation only when gas prices have changed...

  const lastGasEstimates = useRef(gasFeeEstimates);
  const gasEstimatesChanged = !isEqual(
    lastGasEstimates.current,
    gasFeeEstimates,
  ); // ... and only if gas didn't just load
  // Removing this line will cause the initial loading screen to stay empty

  const gasJustLoaded = isEqual(lastGasEstimates.current, {});

  if (gasEstimatesChanged) {
    lastGasEstimates.current = gasFeeEstimates;
  }

  const showLoadingAnimation =
    isGasEstimatesLoading || (gasEstimatesChanged && !gasJustLoaded);
  useEffect(() => {
    if (
      isGasLoadingAnimationActive === false &&
      showLoadingAnimation === true
    ) {
      dispatch(toggleGasLoadingAnimation(true));
    }
  }, [isGasLoadingAnimationActive, showLoadingAnimation]);
  useEffect(() => {
    if (
      isGasLoadingAnimationActive === true &&
      showLoadingAnimation === false
    ) {
      setTimeout(() => {
        dispatch(toggleGasLoadingAnimation(false));
      }, 2000);
    }
  }, [isGasLoadingAnimationActive, showLoadingAnimation]);
}
