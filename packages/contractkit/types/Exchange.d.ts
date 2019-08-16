/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from 'web3/eth/contract'
import { TransactionObject, BlockType } from 'web3/eth/types'
import { Callback, EventLog } from 'web3/types'
import { EventEmitter } from 'events'
import { Provider } from 'web3/providers'

export class Exchange extends Contract {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions)
  _address: string
  options: contractOptions
  methods: {
    spread(): TransactionObject<{
      numerator: string
      denominator: string
      0: string
      1: string
    }>

    reserveFraction(): TransactionObject<{
      numerator: string
      denominator: string
      0: string
      1: string
    }>

    getBuyTokenAmount(sellAmount: number | string, sellGold: boolean): TransactionObject<string>

    getSellTokenAmount(buyAmount: number | string, sellGold: boolean): TransactionObject<string>

    getBuyAndSellBuckets(
      sellGold: boolean
    ): TransactionObject<{
      0: string
      1: string
    }>

    renounceOwnership(): TransactionObject<void>

    setRegistry(registryAddress: string): TransactionObject<void>

    transferOwnership(newOwner: string): TransactionObject<void>

    initialize(
      registryAddress: string,
      stableToken: string,
      spreadNumerator: number | string,
      spreadDenominator: number | string,
      reserveFractionNumerator: number | string,
      reserveFractionDenominator: number | string,
      _updateFrequency: number | string,
      _minimumReports: number | string
    ): TransactionObject<void>

    exchange(
      sellAmount: number | string,
      minBuyAmount: number | string,
      sellGold: boolean
    ): TransactionObject<string>

    setUpdateFrequency(newUpdateFrequency: number | string): TransactionObject<void>

    setMinimumReports(newMininumReports: number | string): TransactionObject<void>

    initialized(): TransactionObject<boolean>
    minimumReports(): TransactionObject<string>
    stable(): TransactionObject<string>
    stableBucket(): TransactionObject<string>
    goldBucket(): TransactionObject<string>
    updateFrequency(): TransactionObject<string>
    registry(): TransactionObject<string>
    owner(): TransactionObject<string>
    isOwner(): TransactionObject<boolean>
    lastBucketUpdate(): TransactionObject<string>
  }
  deploy(options: { data: string; arguments: any[] }): TransactionObject<Contract>
  events: {
    Exchanged(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    UpdateFrequencySet(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    MinimumReportsSet(
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
  clone(): Exchange
}
