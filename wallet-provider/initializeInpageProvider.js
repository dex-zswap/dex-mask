import MetaMaskInpageProvider from './MetaMaskInpageProvider';
import shimWeb3 from './shimWeb3';
/**
 * Initializes a MetaMaskInpageProvider and (optionally) assigns it as window.ethereum.
 *
 * @param options - An options bag.
 * @param options.connectionStream - A Node.js stream.
 * @param options.jsonRpcStreamName - The name of the internal JSON-RPC stream.
 * @param options.maxEventListeners - The maximum number of event listeners.
 * @param options.shouldSendMetadata - Whether the provider should send page metadata.
 * @param options.shouldSetOnWindow - Whether the provider should be set as window.ethereum.
 * @param options.shouldShimWeb3 - Whether a window.web3 shim should be injected.
 * @returns The initialized provider (whether set or not).
 */
export function initializeProvider({ connectionStream, jsonRpcStreamName, logger = console, maxEventListeners = 100, shouldSendMetadata = true, shouldSetOnWindow = true, shouldShimWeb3 = false, }) {
    let provider = new MetaMaskInpageProvider(connectionStream, {
        jsonRpcStreamName,
        logger,
        maxEventListeners,
        shouldSendMetadata,
    });
    provider = new Proxy(provider, {
        // some common libraries, e.g. web3@1.x, mess with our API
        deleteProperty: () => true,
    });
    if (shouldSetOnWindow) {
        setGlobalProvider(provider);
    }
    if (shouldShimWeb3) {
        shimWeb3(provider, logger);
    }
    return provider;
}
/**
 * Sets the given provider instance as window.dexEthereum and dispatches the
 * 'dexEthereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
export function setGlobalProvider(providerInstance) {
    window.dexEthereum = providerInstance;
    window.dispatchEvent(new Event('dexEthereum#initialized'));
}