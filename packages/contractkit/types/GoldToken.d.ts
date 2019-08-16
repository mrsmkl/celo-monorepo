/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from 'web3/eth/contract'
import { TransactionObject, BlockType } from 'web3/eth/types'
import { Callback, EventLog } from 'web3/types'
import { EventEmitter } from 'events'
import { Provider } from 'web3/providers'

export class GoldToken extends Contract {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions)
  _address: string
  options: contractOptions
  methods: {
    allowance(owner: string, spender: string): TransactionObject<string>

    balanceOf(owner: string): TransactionObject<string>

    initialize(): TransactionObject<void>

    transfer(to: string, value: number | string): TransactionObject<boolean>

    transferWithComment(
      to: string,
      value: number | string,
      comment: string
    ): TransactionObject<boolean>

    approve(spender: string, value: number | string): TransactionObject<boolean>

    transferFrom(from: string, to: string, value: number | string): TransactionObject<boolean>

    increaseSupply(amount: number | string): TransactionObject<void>

    initialized(): TransactionObject<boolean>
    name(): TransactionObject<string>
    symbol(): TransactionObject<string>
    decimals(): TransactionObject<string>
    totalSupply(): TransactionObject<string>
  }
  deploy(options: { data: string; arguments: any[] }): TransactionObject<Contract>
  events: {
    Transfer(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    TransferComment(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    Approval(
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
  clone(): GoldToken
}
