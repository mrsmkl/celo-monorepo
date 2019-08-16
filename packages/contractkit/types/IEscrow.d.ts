/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from 'web3/eth/contract'
import { TransactionObject, BlockType } from 'web3/eth/types'
import { Callback, EventLog } from 'web3/types'
import { EventEmitter } from 'events'
import { Provider } from 'web3/providers'

export class IEscrow extends Contract {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions)
  _address: string
  options: contractOptions
  methods: {
    getReceivedPaymentIds(identifier: string | number[]): TransactionObject<(string)[]>

    getSentPaymentIds(sender: string): TransactionObject<(string)[]>

    initialize(registryAddress: string): TransactionObject<void>

    transfer(
      identifier: string | number[],
      token: string,
      value: number | string,
      expirySeconds: number | string,
      paymentId: string,
      minAttestations: number | string
    ): TransactionObject<boolean>

    withdraw(
      paymentID: string,
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<boolean>

    revoke(paymentID: string): TransactionObject<boolean>
  }
  deploy(options: { data: string; arguments: any[] }): TransactionObject<Contract>
  events: {
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
  clone(): IEscrow
}
