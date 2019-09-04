import {
  Callback,
  ErrorCallback,
  PartialTxParams,
  PrivateKeyWalletSubprovider,
} from '@0x/subproviders'
import debugFactory from 'debug'
import { JSONRPCRequestPayload } from 'ethereum-types'
import Web3 from 'web3'
import { Tx } from 'web3/eth/types'
import { signTransaction } from './signing-utils'
import { generateAccountAddressFromPrivateKey } from './web3-utils'

const debug = debugFactory('kit:tx:sign')

export interface CeloTx extends Tx {
  gasCurrency?: string
  gasFeeRecipient?: string
}

export interface CeloPartialTxParams extends PartialTxParams {
  gasCurrency?: string
  gasFeeRecipient?: string
}

function getPrivateKeyWithout0xPrefix(privateKey: string) {
  return privateKey.toLowerCase().startsWith('0x') ? privateKey.substring(2) : privateKey
}

function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined
}

export class CeloPrivateKeyWalletProvider extends PrivateKeyWalletSubprovider {
  private readonly celoPrivateKey: string // Always 0x prefixed
  private readonly accountAddress: string // hex-encoded, lower case alphabets
  private chainId: number | null = null
  private gasFeeRecipient: string | null = null

  constructor(privateKey: string) {
    // This won't accept a privateKey with 0x prefix and will call that an invalid key.
    super(getPrivateKeyWithout0xPrefix(privateKey))
    // Prefix 0x here or else the signed transaction produces dramatically different signer!!!
    this.celoPrivateKey = '0x' + getPrivateKeyWithout0xPrefix(privateKey)
    this.accountAddress = generateAccountAddressFromPrivateKey(this.celoPrivateKey).toLowerCase()
  }

  // Note: There is `getAccountsAsync` as well which this class inherits from the parent class.
  public getAccount(): string {
    return this.accountAddress
  }

  public async handleRequest(
    payload: JSONRPCRequestPayload,
    next: Callback,
    end: ErrorCallback
  ): Promise<void> {
    const signingRequired = [
      'eth_sendTransaction',
      'eth_signTransaction',
      'eth_sign',
      'personal_sign',
      'eth_signTypedData',
    ].includes(payload.method)
    // Either signing is not required or
    // signing is required and this class is the correct one to sign
    const shouldPassToSuperClassForHandling =
      !signingRequired || payload.params[0].from.toLowerCase() === this.accountAddress
    if (shouldPassToSuperClassForHandling) {
      super.handleRequest(payload, next, end)
    } else {
      // Pass it to the next handler to sign
      next()
    }
  }

  public async signTransactionAsync(txParams: CeloPartialTxParams): Promise<string> {
    debug('signTransactionAsync: txParams are %o', txParams)
    if (txParams.from.toLowerCase() !== this.accountAddress) {
      // If `handleRequest` works correctly then this code path should never trigger.
      throw new Error(
        `Transaction ${JSON.stringify(txParams)} cannot be signed by account "${
          this.accountAddress
        }",` + ` it should be signed by "${txParams.from}"`
      )
    } else {
      debug(`Signer is correct: ${this.accountAddress}`)
    }
    if (isNullOrUndefined(txParams.chainId)) {
      txParams.chainId = await this.getChainId()
    }

    if (isNullOrUndefined(txParams.nonce)) {
      txParams.nonce = await this.getNonce(txParams.from)
    }

    if (isNullOrUndefined(txParams.gasFeeRecipient)) {
      txParams.gasFeeRecipient = await this.getCoinbase()
      if (isNullOrUndefined(txParams.gasFeeRecipient)) {
        // Fail early. The validator nodes will reject a transaction missing
        // gas fee recipient anyways.
        throw new Error(
          'Gas fee recipient is missing, cannot retrieve it' +
            ' from web3.eth.getCoinbase() either cannot process transaction'
        )
      }
    }

    if (isNullOrUndefined(txParams.gasPrice)) {
      txParams.gasPrice = await this.getGasPrice()
    }

    const signedTx = await signTransaction(txParams, this.celoPrivateKey)
    const rawTransaction = signedTx.rawTransaction.toString('hex')
    return rawTransaction
  }

  private async getChainId(): Promise<number> {
    if (this.chainId === null) {
      debug('getChainId fetching chainId...')
      // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version
      const result = await this.emitPayloadAsync({
        method: 'net_version',
        params: [],
      })
      this.chainId = parseInt(result.result.toString(), 10)
      debug('getChainId chain result ID is %s', this.chainId)
    }
    return this.chainId!
  }

  private async getNonce(address: string): Promise<string> {
    debug('getNonce fetching nonce...')
    // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount
    const result = await this.emitPayloadAsync({
      method: 'eth_getTransactionCount',
      params: [address, 'pending'],
    })
    const nonce = result.result.toString()
    debug('getNonce Nonce is %s', nonce)
    return nonce
  }

  private async getCoinbase(): Promise<string> {
    if (this.gasFeeRecipient === null) {
      debug('getCoinbase fetching Coinbase...')
      // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_coinbase
      const result = await this.emitPayloadAsync({
        method: 'eth_coinbase',
        params: [],
      })
      this.gasFeeRecipient = result.result.toString()
      debug('getCoinbase gas fee recipient is %s', this.gasFeeRecipient)
    }
    return this.gasFeeRecipient!
  }

  private async getGasPrice(): Promise<string> {
    debug('getGasPrice fetching gas price...')
    // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice
    const result = await this.emitPayloadAsync({
      method: 'eth_gasPrice',
      params: [],
    })
    const gasPriceInHex = result.result.toString()
    debug('getGasPrice gas price is %s', parseInt(gasPriceInHex.substr(2), 16))
    return gasPriceInHex
  }
}

/**
 * This method is primarily used for testing at this point.
 * Returns a raw signed transaction which can be used for Celo gold transfer.
 * It is the responsibility of the caller to submit it to the network.
 */
export async function getRawTransaction(web3: Web3, transaction: CeloTx): Promise<string> {
  debug('getRawTransaction@Signing transaction...')
  const signedTransaction = await web3.eth.signTransaction(transaction)
  debug('getRawTransaction@Signing: Signed transaction %o', signedTransaction)
  const rawTransaction = signedTransaction.raw
  return rawTransaction
}
