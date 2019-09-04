import {
  Callback,
  ErrorCallback,
  JSONRPCRequestPayload,
  JSONRPCResponsePayload,
  Subprovider,
  Web3ProviderEngine,
} from '@0x/subproviders'
import debugFactory from 'debug'
import Web3 from 'web3'
import { JsonRPCResponse, Provider } from 'web3/providers'
import { CeloPrivateKeyWalletProvider } from './tx-signing'

const debug = debugFactory('kit:web3:utils')

export function generateAccountAddressFromPrivateKey(privateKey: string): string {
  if (!privateKey.toLowerCase().startsWith('0x')) {
    privateKey = '0x' + privateKey
  }
  return new Web3().eth.accounts.privateKeyToAccount(privateKey).address
}

// Return the modified web3 object for chaining
export function addLocalAccount(web3: Web3, privateKey: string): Web3 {
  const existingProvider = web3.currentProvider
  const providerEngine: CeloProvider =
    existingProvider instanceof CeloProvider ? existingProvider : new CeloProvider(existingProvider)
  providerEngine.addAccount(privateKey)
  web3.setProvider(providerEngine)
  providerEngine.start()
  debug('Providers configured')
  return web3
}

class WrappingSubprovider extends Subprovider {
  private _provider: Provider

  constructor(readonly provider: Provider) {
    super()
    this._provider = provider
  }
  /**
   * @param payload JSON RPC request payload
   * @param next A callback to pass the request to the next subprovider in the stack
   * @param end A callback called once the subprovider is done handling the request
   */
  handleRequest(
    payload: JSONRPCRequestPayload,
    _next: Callback,
    end: ErrorCallback
  ): Promise<void> {
    debug('WrappingSubprovider@handleRequest: %o', payload)
    // Inspired from https://github.com/MetaMask/web3-provider-engine/pull/19/
    return this._provider.send(payload, (err: null | Error, response?: JsonRPCResponse) => {
      if (err != null) {
        debug('WrappingSubprovider@response is error: %s', err)
        end(err)
        return
      }
      if (response == null) {
        end(new Error(`Response is null for ${JSON.stringify(payload)}`))
        return
      }
      if (response.error != null) {
        debug('WrappingSubprovider@response includes error: %o', response)
        end(new Error(response.error))
        return
      }
      debug('WrappingSubprovider@response: %o', response)
      end(null, response.result)
    })
  }
}

// tslint:disable-next-line:max-classes-per-file
export class CeloProvider implements Provider {
  private static createNewProviderWithLocalAccount(existingProvider: Provider): Web3ProviderEngine {
    // Create a Web3 Provider Engine
    const providerEngine = new Web3ProviderEngine()
    // Use the existing provider to route all other requests
    const wrappingSubprovider = new WrappingSubprovider(existingProvider)
    debug('Setting up providers...')
    providerEngine.addProvider(wrappingSubprovider)
    return providerEngine
  }

  private web3ProviderEngine: Web3ProviderEngine
  private signingProviders: CeloPrivateKeyWalletProvider[]
  private signingAddresses: string[]

  constructor(readonly existingProvider: Provider) {
    this.web3ProviderEngine = CeloProvider.createNewProviderWithLocalAccount(existingProvider)
    this.signingProviders = []
    this.signingAddresses = []
  }

  addAccount(privateKey: string): CeloProvider {
    if (this.signingAddresses.includes(privateKey)) {
      debug('Account is already added')
      return this
    }

    const localAccountProvider = new CeloPrivateKeyWalletProvider(privateKey)
    // When a private key has already been added, add a new one before
    // all other providers.
    this.signingProviders.splice(0, 0, localAccountProvider)
    // I could not find a better way to do this, so, I had to
    // access the private `_providers` field of providerEngine
    // @ts-ignore-next-line
    this.web3ProviderEngine._providers.splice(0, 0, localAccountProvider)
    localAccountProvider.setEngine(this.web3ProviderEngine)
    this.signingAddresses.push(localAccountProvider.getAccount())
    return this
  }

  on(event: string, handler: () => void): void {
    this.web3ProviderEngine.on(event, handler)
  }

  send(payload: JSONRPCRequestPayload): void {
    this.web3ProviderEngine.send(payload)
  }

  sendAsync(
    payload: JSONRPCRequestPayload,
    callback: (error: null | Error, response: JSONRPCResponsePayload) => void
  ): void {
    this.web3ProviderEngine.sendAsync(payload, callback)
  }

  start(callback?: () => void): void {
    this.web3ProviderEngine.start(callback)
  }

  stop() {
    this.web3ProviderEngine.stop()
  }
}
