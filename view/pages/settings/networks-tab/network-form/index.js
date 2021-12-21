import Button from '@c/ui/button';
import TextField from '@c/ui/text-field';
import Tooltip from '@c/ui/tooltip';
import {
  isPrefixedFormattedHexString,
  isSafeChainId,
} from '@shared/modules/network.utils';
import { jsonRpcRequest } from '@shared/modules/rpc.utils';
import { decimalToHex } from '@view/helpers/utils/conversions.util';
import { useI18nContext } from '@view/hooks/useI18nContext';
import { showModal } from '@view/store/actions';
import log from 'loglevel';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import validUrl from 'valid-url';

const getDisplayChainId = (chainId) => {
  if (!chainId || typeof chainId !== 'string' || !chainId.startsWith('0x')) {
    return chainId;
  }
  return parseInt(chainId, 16).toString(10);
};

const prefixChainId = (chainId) => {
  let prefixedChainId = chainId;

  if (!chainId.startsWith('0x')) {
    prefixedChainId = `0x${parseInt(chainId, 10).toString(16)}`;
  }

  return prefixedChainId;
};

const isValidWhenAppended = (url) => {
  const appendedRpc = `http://${url}`;
  return validUrl.isWebUri(appendedRpc) && !url.match(/^https?:\/\/$/u);
};

export default function NetworkForm(props) {
  const {
    editRpc,
    viewOnly,
    onClear,
    setRpcTarget,
    networksTabIsInAddMode,
    isCurrentRpcTarget,
    rpcPrefs = {},
    networksToRender,
  } = props;
  const t = useI18nContext();
  const dispatch = useDispatch();

  const [rpcUrl, setRpcUrl] = useState(props?.rpcUrl || '');
  const [chainId, setChainId] = useState(
    getDisplayChainId(props?.chainId || ''),
  );
  const [ticker, setTicker] = useState(props?.ticker || '');
  const [networkName, setNetworkName] = useState(props?.networkName || '');
  const [blockExplorerUrl, setBlockExplorerUrl] = useState(
    props?.blockExplorerUrl || '',
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      setRpcUrl('');
      setChainId('');
      setTicker('');
      setNetworkName('');
      setBlockExplorerUrl('');
      setErrors({});
      onClear(false);
    };
  }, []);

  const resetForm = useCallback(() => {
    setRpcUrl(props?.rpcUrl || '');
    setChainId(getDisplayChainId(props?.chainId || ''));
    setTicker(props?.ticker || '');
    setNetworkName(props?.networkName || '');
    setBlockExplorerUrl(props?.blockExplorerUrl || '');
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const setErrorTo = useCallback((errorKey, errorVal) => {
    setErrors((pre) => {
      return { errors: { ...pre, [errorKey]: errorVal } };
    });
  }, []);

  const setErrorEmpty = useCallback((errorKey) => {
    setErrors((pre) => {
      return {
        errors: {
          ...pre,
          [errorKey]: {
            msg: '',
            key: '',
          },
        },
      };
    });
  }, []);

  const hasError = useCallback(
    (errorKey, errorKeyVal) => errors[errorKey]?.key === errorKeyVal,
    [errors],
  );

  const hasErrors = useCallback(() => {
    return Object.keys(errors).some((key) => {
      const error = errors[key];
      if (key === 'chainId' && error.key === 'chainIdExistsErrorMsg') {
        return false;
      }
      return error.key && error.msg;
    });
  }, [errors]);

  const validateChainIdOnSubmit = useCallback(
    async (formChainId, parsedChainId, rpcUrl) => {
      let errorKey;
      let errorMessage;
      let endpointChainId;
      let providerError;

      try {
        endpointChainId = await jsonRpcRequest(rpcUrl, 'eth_chainId');
      } catch (err) {
        log.warn('Failed to fetch the chainId from the endpoint.', err);
        providerError = err;
      }

      if (providerError || typeof endpointChainId !== 'string') {
        errorKey = 'failedToFetchChainId';
        errorMessage = t('failedToFetchChainId');
      } else if (parsedChainId !== endpointChainId) {
        if (!formChainId.startsWith('0x')) {
          try {
            endpointChainId = parseInt(endpointChainId, 16).toString(10);
          } catch (err) {
            log.warn(
              'Failed to convert endpoint chain ID to decimal',
              endpointChainId,
            );
          }
        }

        errorKey = 'endpointReturnedDifferentChainId';
        errorMessage = t('endpointReturnedDifferentChainId', [
          endpointChainId.length <= 12
            ? endpointChainId
            : `${endpointChainId.slice(0, 9)}...`,
        ]);
      }

      if (errorKey) {
        setErrorTo('chainId', {
          key: errorKey,
          msg: errorMessage,
        });
        return false;
      }

      setErrorEmpty('chainId');
      return true;
    },
    [t, setErrorTo, setErrorEmpty],
  );

  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const propsRpcUrl = props?.rpcUrl;
      const formChainId = chainId.trim().toLowerCase();
      const handledChainId = prefixChainId(formChainId);

      if (
        !(await validateChainIdOnSubmit(formChainId, handledChainId, rpcUrl))
      ) {
        setIsSubmitting(false);
        return;
      }

      if (propsRpcUrl && rpcUrl !== propsRpcUrl) {
        await editRpc(
          propsRpcUrl,
          rpcUrl,
          handledChainId,
          ticker,
          networkName,
          {
            ...rpcPrefs,
            blockExplorerUrl: blockExplorerUrl || rpcPrefs.blockExplorerUrl,
          },
        );
      } else {
        await setRpcTarget(rpcUrl, handledChainId, ticker, networkName, {
          ...rpcPrefs,
          blockExplorerUrl: blockExplorerUrl || rpcPrefs.blockExplorerUrl,
        });
      }

      if (networksTabIsInAddMode) {
        onClear();
      }
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
  }, [
    props?.rpcUrl,
    ticker,
    rpcPrefs,
    networkName,
    blockExplorerUrl,
    rpcUrl,
    chainId,
    networksTabIsInAddMode,
    validateChainIdOnSubmit,
  ]);

  const onDelete = useCallback(() => {
    dispatch(
      showModal({
        name: 'CONFIRM_DELETE_NETWORK',
        target: props?.rpcUrl,
        onConfirm: () => {
          resetForm();
          onClear();
        },
      }),
    );
  }, [props?.rpcUrl, onClear, resetForm]);

  const stateIsUnchanged = useCallback(() => {
    const chainIdIsUnchanged =
      typeof props?.chainId === 'string' &&
      props?.chainId.toLowerCase().startsWith('0x') &&
      chainId === getDisplayChainId(props?.chainId);
    return (
      rpcUrl === props?.rpcUrl &&
      chainIdIsUnchanged &&
      ticker === props?.ticker &&
      networkName === props?.networkName &&
      blockExplorerUrl === props?.blockExplorerUrl
    );
  }, [
    props?.chainId,
    props?.rpcUrl,
    props?.ticker,
    props?.networkName,
    props?.blockExplorerUrl,
    chainId,
    rpcUrl,
    ticker,
    networkName,
    blockExplorerUrl,
  ]);

  const validateChainIdOnChange = useCallback(
    (chainIdArg = '') => {
      const trimedChainId = chainIdArg.trim();
      let errorKey = '';
      let errorMessage = '';
      let radix = 10;
      let hexChainId = trimedChainId;

      if (!hexChainId.startsWith('0x')) {
        try {
          hexChainId = `0x${decimalToHex(hexChainId)}`;
        } catch (err) {
          setErrorTo('chainId', {
            key: 'invalidHexNumber',
            msg: t('invalidHexNumber'),
          });
          return;
        }
      }

      const [matchingChainId] = networksToRender.filter(
        (e) => e.chainId === hexChainId && e.rpcUrl !== rpcUrl,
      );

      if (trimedChainId === '') {
        setErrorEmpty('chainId');
        return;
      } else if (matchingChainId) {
        errorKey = 'chainIdExistsErrorMsg';
        errorMessage = t('chainIdExistsErrorMsg', [
          matchingChainId.label ?? matchingChainId.labelKey,
        ]);
      } else if (trimedChainId.startsWith('0x')) {
        radix = 16;

        if (!/^0x[0-9a-f]+$/iu.test(trimedChainId)) {
          errorKey = 'invalidHexNumber';
          errorMessage = t('invalidHexNumber');
        } else if (!isPrefixedFormattedHexString(trimedChainId)) {
          errorMessage = t('invalidHexNumberLeadingZeros');
        }
      } else if (!/^[0-9]+$/u.test(trimedChainId)) {
        errorKey = 'invalidNumber';
        errorMessage = t('invalidNumber');
      } else if (trimedChainId.startsWith('0')) {
        errorKey = 'invalidNumberLeadingZeros';
        errorMessage = t('invalidNumberLeadingZeros');
      } else if (!isSafeChainId(parseInt(trimedChainId, radix))) {
        errorKey = 'invalidChainIdTooBig';
        errorMessage = t('invalidChainIdTooBig');
      }

      setErrorTo('chainId', {
        key: errorKey,
        msg: errorMessage,
      });
    },
    [setErrorTo, networksToRender, t, rpcUrl],
  );

  const validateBlockExplorerURL = useCallback(
    (url, stateKey) => {
      if (!validUrl.isWebUri(url) && url !== '') {
        let errorKey;
        let errorMessage;
        if (isValidWhenAppended(url)) {
          errorKey = 'urlErrorMsg';
          errorMessage = t('urlErrorMsg');
        } else {
          errorKey = 'invalidBlockExplorerURL';
          errorMessage = t('invalidBlockExplorerURL');
        }
        setErrorTo(stateKey, {
          key: errorKey,
          msg: errorMessage,
        });
      } else {
        setErrorEmpty(stateKey);
      }
    },
    [t, isValidWhenAppended, setErrorTo, setErrorEmpty],
  );

  const validateUrlRpcUrl = useCallback(
    (url, stateKey) => {
      const isValidUrl = validUrl.isWebUri(url);
      const chainIdFetchFailed = hasError('chainId', 'failedToFetchChainId');
      const [matchingRPCUrl] = networksToRender.filter((e) => e.rpcUrl === url);

      if (!isValidUrl && url !== '') {
        let errorKey;
        let errorMessage;
        if (isValidWhenAppended(url)) {
          errorKey = 'urlErrorMsg';
          errorMessage = t('urlErrorMsg');
        } else {
          errorKey = 'invalidRPC';
          errorMessage = t('invalidRPC');
        }
        setErrorTo(stateKey, {
          key: errorKey,
          msg: errorMessage,
        });
      } else if (matchingRPCUrl) {
        setErrorTo(stateKey, {
          key: 'urlExistsErrorMsg',
          msg: t('urlExistsErrorMsg', [
            matchingRPCUrl.label ?? matchingRPCUrl.labelKey,
          ]),
        });
      } else {
        setErrorEmpty(stateKey);
      }
      if (chainId && isValidUrl && chainIdFetchFailed) {
        const formChainId = chainId.trim().toLowerCase();
        const handlerdChanId = prefixChainId(formChainId);
        validateChainIdOnSubmit(formChainId, handlerdChanId, url);
      }
    },
    [
      t,
      networksToRender,
      chainId,
      hasError,
      validateChainIdOnSubmit,
      setErrorEmpty,
      setErrorTo,
    ],
  );

  const deletable = !networksTabIsInAddMode && !isCurrentRpcTarget && !viewOnly;

  const isSubmitDisabled =
    hasErrors() || isSubmitting || stateIsUnchanged() || !rpcUrl || !chainId;

  const renderWarning = useMemo(
    () => (
      <div className="networks-form-warning-wrap">
        <img
          style={{ margin: '0px 6px -1px 0' }}
          width={12}
          src="images/settings/info.png"
        />
        <span>{t('onlyAddTrustedNetworks')}</span>
      </div>
    ),
    [t],
  );

  const renderFormTextField = useCallback(
    ({
      fieldKey,
      onChange,
      value,
      optionalTextFieldKey,
      tooltipText,
      autoFocus = false,
    }) => {
      const errorMessage = errors[fieldKey]?.msg || '';
      return (
        <div className="setting-item">
          <div className="setting-label">
            <span>{t(optionalTextFieldKey || fieldKey)}</span>
            {!viewOnly && tooltipText && (
              <Tooltip position="top" title={tooltipText}>
                <div>
                  <img
                    style={{ margin: '1px 0 0 10px' }}
                    width={12}
                    src="images/settings/info.png"
                  />
                </div>
              </Tooltip>
            )}
          </div>
          <TextField
            type="text"
            onChange={onChange}
            value={value}
            disabled={viewOnly}
            error={errorMessage}
            autoFocus={autoFocus}
          />
        </div>
      );
    },
    [t, errors],
  );

  return (
    <div className="base-width">
      {viewOnly ? null : renderWarning}
      {renderFormTextField({
        fieldKey: 'networkName',
        onChange: ({ target }) => {
          setNetworkName(target.value);
        },
        value: networkName,
        autoFocus: networksTabIsInAddMode,
      })}
      {renderFormTextField({
        fieldKey: 'rpcUrl',
        onChange: ({ target }) => {
          validateUrlRpcUrl(target.value, 'rpcUrl');
          setRpcUrl(target.value);
        },
        value: rpcUrl,
      })}
      {renderFormTextField({
        fieldKey: 'chainId',
        onChange: ({ target }) => {
          validateChainIdOnChange(target.value);
          setChainId(target.value);
        },
        value: chainId,
        tooltipText: viewOnly ? null : t('networkSettingsChainIdDescription'),
      })}
      {renderFormTextField({
        fieldKey: 'symbol',
        onChange: ({ target }) => {
          setTicker(target.value);
        },
        value: ticker,
        optionalTextFieldKey: 'optionalCurrencySymbol',
      })}
      {renderFormTextField({
        fieldKey: 'blockExplorerUrl',
        onChange: ({ target }) => {
          validateBlockExplorerURL(target.value, 'blockExplorerUrl');
          setBlockExplorerUrl(target.value);
        },
        value: blockExplorerUrl,
        optionalTextFieldKey: 'optionalBlockExplorerUrl',
      })}
      {!viewOnly && (
        <div className="flex space-between">
          <Button className="half-button" onClick={onClear}>
            {t('cancel')}
          </Button>
          <Button
            type="primary"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="half-button"
          >
            {t('save')}
          </Button>
        </div>
      )}
      {deletable && (
        <div style={{ marginTop: '15px' }}>
          <Button type="warning" onClick={onDelete}>
            {t('delete')}
          </Button>
        </div>
      )}
    </div>
  );
}
