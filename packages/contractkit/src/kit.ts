import Web3 from 'web3'
import { TransactionObject, Tx } from 'web3/eth/types'
import { AddressRegistry } from './address-registry'
import { Address, CeloContract, CeloToken } from './base'
import { WrapperCache } from './contract-cache'
import { GasPriceMinimum } from './generated/types/GasPriceMinimum'
import { sendTransaction, TxOptions } from './utils/send-tx'
import { toTxResult, TransactionResult } from './utils/tx-result'
import { addLocalAccount } from './utils/web3-utils'
import { Web3ContractCache } from './web3-contract-cache'

export function newKit(url: string) {
  return newKitFromWeb3(new Web3(url))
}

export function newKitFromWeb3(web3: Web3) {
  return new ContractKit(web3)
}

export class ContractKit {
  readonly registry: AddressRegistry
  readonly _web3Contracts: Web3ContractCache
  readonly contracts: WrapperCache

  private _defaultOptions: TxOptions
  constructor(readonly web3: Web3) {
    this._defaultOptions = {
      gasInflationFactor: 1.3,
    }

    this.registry = new AddressRegistry(this)
    this._web3Contracts = new Web3ContractCache(this)
    this.contracts = new WrapperCache(this)
  }

  async setGasCurrency(token: CeloToken) {
    this._defaultOptions.gasCurrency =
      token === CeloContract.GoldToken ? undefined : await this.registry.addressFor(token)
  }

  set defaultAccount(address: Address) {
    this._defaultOptions.from = address
    this.web3.eth.defaultAccount = address
  }

  get defaultAccount(): Address {
    return this.web3.eth.defaultAccount
  }

  get defaultOptions(): Readonly<TxOptions> {
    return { ...this._defaultOptions }
  }

  addAccount(privateKey: string) {
    addLocalAccount(this.web3, privateKey)
  }

  setGasCurrencyAddress(address: Address) {
    this._defaultOptions.gasCurrency = address
  }

  async sendTransaction(tx: Tx): Promise<TransactionResult> {
    const gasFeeRecipient = await this.web3.eth.getCoinbase()
    // Fail early if gas fee recipient is not available.
    // Most likely cause is that the client is connected to a light node and not
    // a full node.
    if (gasFeeRecipient === null || gasFeeRecipient.length === 0) {
      throw new Error(
        `Gas Fee Recipient ${gasFeeRecipient} is missing for a locally signed transaction.`
      )
    }
    const promiEvent = this.web3.eth.sendTransaction({
      from: this._defaultOptions.from,
      gasPrice: '0',
      // @ts-ignore
      gasCurrency: this._defaultOptions.gasCurrency,
      // @ts-ignore
      gasFeeRecipient: this.defaultOptions.gasFeeRecipient,
      // TODO needed for locally signed tx, ignored by now (celo-blockchain with set it)
      // gasFeeRecipient: this.defaultOptions.gasFeeRecipient,
      ...tx,
    })
    return toTxResult(promiEvent)
  }

  async getGasPrice(gasCurrency: string | undefined): Promise<string | undefined> {
    // Gold Token
    if (gasCurrency === undefined) {
      return String(await this.web3.eth.getGasPrice())
    }
    const gasPriceMinimum: GasPriceMinimum = await this._web3Contracts.getGasPriceMinimum()
    return gasPriceMinimum.methods.getGasPriceMinimum(gasCurrency).call()
  }

  sendTransactionObject(
    txObj: TransactionObject<any>,
    options?: TxOptions
  ): Promise<TransactionResult> {
    return sendTransaction(txObj, {
      ...this._defaultOptions,
      ...options,
    })
  }
}
