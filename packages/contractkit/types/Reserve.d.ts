/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from 'web3/eth/contract'
import { TransactionObject, BlockType } from 'web3/eth/types'
import { Callback, EventLog } from 'web3/types'
import { EventEmitter } from 'events'
import { Provider } from 'web3/providers'

export class Reserve extends Contract {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions)
  _address: string
  options: contractOptions
  methods: {
    isToken(arg0: string): TransactionObject<boolean>

    tobinTaxCache(): TransactionObject<{
      numerator: string
      timestamp: string
      0: string
      1: string
    }>

    isSpender(arg0: string): TransactionObject<boolean>

    renounceOwnership(): TransactionObject<void>

    setRegistry(registryAddress: string): TransactionObject<void>

    transferOwnership(newOwner: string): TransactionObject<void>

    initialize(
      registryAddress: string,
      _tobinTaxStalenessThreshold: number | string
    ): TransactionObject<void>

    setTobinTaxStalenessThreshold(value: number | string): TransactionObject<void>

    addToken(token: string): TransactionObject<boolean>

    removeToken(token: string, index: number | string): TransactionObject<boolean>

    addSpender(spender: string): TransactionObject<void>

    removeSpender(spender: string): TransactionObject<void>

    burnToken(token: string): TransactionObject<boolean>

    transferGold(to: string, value: number | string): TransactionObject<boolean>

    getOrComputeTobinTax(): TransactionObject<{
      0: string
      1: string
    }>

    TOBIN_TAX_DENOMINATOR(): TransactionObject<string>
    initialized(): TransactionObject<boolean>
    registry(): TransactionObject<string>
    owner(): TransactionObject<string>
    isOwner(): TransactionObject<boolean>
    tobinTaxStalenessThreshold(): TransactionObject<string>
    getTokens(): TransactionObject<(string)[]>
  }
  deploy(options: { data: string; arguments: any[] }): TransactionObject<Contract>
  events: {
    TobinTaxStalenessThresholdSet(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    TokenAdded(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    TokenRemoved(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    SpenderAdded(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    SpenderRemoved(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    RegistrySet(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    OwnershipTransferred(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    allEvents: (
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ) => EventEmitter
  }
  getPastEvents(
    event: string,
    options?: {
      filter?: object
      fromBlock?: BlockType
      toBlock?: BlockType
      topics?: (null | string)[]
    },
    cb?: Callback<EventLog[]>
  ): Promise<EventLog[]>
  setProvider(provider: Provider): void
  clone(): Reserve
}
