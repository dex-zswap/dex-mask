import Box from '@c/ui/box';
import PulseLoader from '@c/ui/pulse-loader';
import Typography from '@c/ui/typography';
import SwapsFooter from '@pages/swaps/swaps-footer';
import {
  getApproveTxParams,
  getFetchParams,
  prepareToLeaveSwaps,
} from '@reducer/swaps/swaps';
import { getHardwareWalletType, isHardwareWallet } from '@selectors/selectors';
import { I18nContext } from '@view/contexts/i18n';
import {
  BLOCK_SIZES,
  COLORS,
  DISPLAY,
  FONT_WEIGHT,
  JUSTIFY_CONTENT,
  TYPOGRAPHY,
} from '@view/helpers/constants/design-system';
import {
  BUILD_QUOTE_ROUTE,
  DEFAULT_ROUTE,
} from '@view/helpers/constants/routes';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SwapStepIcon from './swap-step-icon';

export default function AwaitingSignatures() {
  const t = useContext(I18nContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const fetchParams = useSelector(getFetchParams);
  const { destinationTokenInfo, sourceTokenInfo } = fetchParams?.metaData || {};
  const approveTxParams = useSelector(getApproveTxParams);
  const hardwareWalletUsed = useSelector(isHardwareWallet);
  const hardwareWalletType = useSelector(getHardwareWalletType);
  const needsTwoConfirmations = Boolean(approveTxParams);

  const headerText = needsTwoConfirmations
    ? t('swapTwoTransactions')
    : t('swapConfirmWithHwWallet');

  return (
    <div className="awaiting-signatures">
      <Box
        paddingLeft={8}
        paddingRight={8}
        height={BLOCK_SIZES.FULL}
        justifyContent={JUSTIFY_CONTENT.CENTER}
        display={DISPLAY.FLEX}
        className="awaiting-signatures__content"
      >
        <Box marginTop={3} marginBottom={4}>
          <PulseLoader />
        </Box>
        <Typography color={COLORS.BLACK} variant={TYPOGRAPHY.H3}>
          {headerText}
        </Typography>
        {needsTwoConfirmations && (
          <>
            <Typography
              variant={TYPOGRAPHY.Paragraph}
              boxProps={{ marginTop: 2 }}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              {t('swapToConfirmWithHwWallet')}
            </Typography>
            <ul className="awaiting-signatures__steps">
              <li>
                <SwapStepIcon stepNumber={1} />
                {t('swapAllowSwappingOf', [
                  <Typography
                    tag="span"
                    fontWeight={FONT_WEIGHT.BOLD}
                    key="allowToken"
                  >
                    {destinationTokenInfo?.symbol}
                  </Typography>,
                ])}
              </li>
              <li>
                <SwapStepIcon stepNumber={2} />
                {t('swapFromTo', [
                  <Typography
                    tag="span"
                    fontWeight={FONT_WEIGHT.BOLD}
                    key="tokenFrom"
                  >
                    {sourceTokenInfo?.symbol}
                  </Typography>,
                  <Typography
                    tag="span"
                    fontWeight={FONT_WEIGHT.BOLD}
                    key="tokenTo"
                  >
                    {destinationTokenInfo?.symbol}
                  </Typography>,
                ])}
              </li>
            </ul>
            <Typography variant={TYPOGRAPHY.Paragraph}>
              {t('swapGasFeesSplit')}
            </Typography>
          </>
        )}
      </Box>
      <SwapsFooter
        onSubmit={async () => {
          await dispatch(prepareToLeaveSwaps());
          // Go to the default route and then to the build quote route in order to clean up
          // the `inputValue` local state in `pages/swaps/index.js`
          history.push(DEFAULT_ROUTE);
          history.push(BUILD_QUOTE_ROUTE);
        }}
        submitText={t('cancel')}
        hideCancel
      />
    </div>
  );
}
