/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import Contract, { CustomOptions, contractOptions } from 'web3/eth/contract'
import { TransactionObject, BlockType } from 'web3/eth/types'
import { Callback, EventLog } from 'web3/types'
import { EventEmitter } from 'events'
import { Provider } from 'web3/providers'

export class BondedDeposits extends Contract {
  constructor(jsonInterface: any[], address?: string, options?: CustomOptions)
  _address: string
  options: contractOptions
  methods: {
    cumulativeRewardWeights(
      arg0: number | string
    ): TransactionObject<{
      numerator: string
      denominator: string
      0: string
      1: string
    }>

    delegations(arg0: string): TransactionObject<string>

    isVotingFrozen(account: string): TransactionObject<boolean>

    getRewardsLastRedeemed(_account: string): TransactionObject<string>

    getNoticePeriods(_account: string): TransactionObject<(string)[]>

    getAvailabilityTimes(_account: string): TransactionObject<(string)[]>

    getBondedDeposit(
      _account: string,
      noticePeriod: number | string
    ): TransactionObject<{
      0: string
      1: string
    }>

    getNotifiedDeposit(
      _account: string,
      availabilityTime: number | string
    ): TransactionObject<{
      0: string
      1: string
    }>

    getAccountFromVoter(accountOrDelegate: string): TransactionObject<string>

    getAccountFromValidator(accountOrDelegate: string): TransactionObject<string>

    getAccountWeight(_account: string): TransactionObject<string>

    getAccountFromRewardsRecipient(accountOrDelegate: string): TransactionObject<string>

    isVoting(account: string): TransactionObject<boolean>

    getDepositWeight(
      value: number | string,
      noticePeriod: number | string
    ): TransactionObject<string>

    getRewardsRecipientFromAccount(account: string): TransactionObject<string>

    getVoterFromAccount(account: string): TransactionObject<string>

    getValidatorFromAccount(account: string): TransactionObject<string>

    renounceOwnership(): TransactionObject<void>

    setRegistry(registryAddress: string): TransactionObject<void>

    transferOwnership(newOwner: string): TransactionObject<void>

    initialize(registryAddress: string, _maxNoticePeriod: number | string): TransactionObject<void>

    setCumulativeRewardWeight(blockReward: number | string): TransactionObject<void>

    setMaxNoticePeriod(_maxNoticePeriod: number | string): TransactionObject<void>

    createAccount(): TransactionObject<boolean>

    redeemRewards(): TransactionObject<string>

    delegateVoting(
      delegate: string,
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<void>

    freezeVoting(): TransactionObject<void>

    unfreezeVoting(): TransactionObject<void>

    delegateValidating(
      delegate: string,
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<void>

    delegateRewards(
      delegate: string,
      v: number | string,
      r: string | number[],
      s: string | number[]
    ): TransactionObject<void>

    deposit(noticePeriod: number | string): TransactionObject<string>

    notify(value: number | string, noticePeriod: number | string): TransactionObject<string>

    rebond(value: number | string, availabilityTime: number | string): TransactionObject<string>

    withdraw(availabilityTime: number | string): TransactionObject<string>

    increaseNoticePeriod(
      value: number | string,
      noticePeriod: number | string,
      increase: number | string
    ): TransactionObject<string>

    initialized(): TransactionObject<boolean>
    registry(): TransactionObject<string>
    owner(): TransactionObject<string>
    isOwner(): TransactionObject<boolean>
    totalWeight(): TransactionObject<string>
    maxNoticePeriod(): TransactionObject<string>
  }
  deploy(options: { data: string; arguments: any[] }): TransactionObject<Contract>
  events: {
    MaxNoticePeriodSet(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    VotingDelegated(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    VotingFrozen(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    VotingUnfrozen(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    ValidatingDelegated(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    RewardsDelegated(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    DepositBonded(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    DepositNotified(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    DepositRebonded(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    Withdrawal(
      options?: {
        filter?: object
        fromBlock?: BlockType
        topics?: (null | string)[]
      },
      cb?: Callback<EventLog>
    ): EventEmitter

    NoticePeriodIncreased(
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
  clone(): BondedDeposits
}
