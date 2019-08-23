import { zip } from '@celo/utils/lib/src/collections'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { TransactionObject } from 'web3/eth/types'
import { Address } from '../base'
import { BondedDeposits } from '../generated/types/BondedDeposits'
import {
  BaseWrapper,
  CeloTransactionObject,
  proxyCall,
  proxySend,
  toBigNumber,
  wrapSend,
} from '../wrappers/BaseWrapper'

export interface VotingDetails {
  accountAddress: Address
  voterAddress: Address
  weight: BigNumber
}

interface Deposit {
  time: BigNumber
  value: BigNumber
}

export interface Deposits {
  bonded: Deposit[]
  notified: Deposit[]
  total: {
    gold: BigNumber
    weight: BigNumber
  }
}

enum Roles {
  validating,
  voting,
  rewards,
}

export class BondedDepositsWrapper extends BaseWrapper<BondedDeposits> {
  notify = proxySend(this.kit, this.contract.methods.notify)
  createAccount = proxySend(this.kit, this.contract.methods.createAccount)
  withdraw = proxySend(this.kit, this.contract.methods.withdraw)
  redeemRewards = proxySend(this.kit, this.contract.methods.redeemRewards)
  deposit = proxySend(this.kit, this.contract.methods.deposit)
  isVoting = proxyCall(this.contract.methods.isVoting)
  maxNoticePeriod = proxyCall(this.contract.methods.maxNoticePeriod, undefined, toBigNumber)

  getAccountWeight = proxyCall(this.contract.methods.getAccountWeight, undefined, toBigNumber)

  async getVotingDetails(accountOrVoterAddress: Address): Promise<VotingDetails> {
    const accountAddress = await this.contract.methods
      .getAccountFromDelegateAndRole(accountOrVoterAddress, Roles.voting)
      .call()

    return {
      accountAddress,
      voterAddress: accountOrVoterAddress,
      weight: await this.getAccountWeight(accountAddress),
    }
  }

  async getBondedDepositValue(account: string, noticePeriod: string): Promise<BigNumber> {
    const deposit = await this.contract.methods.getBondedDeposit(account, noticePeriod).call()
    return this.getValueFromDeposit(deposit)
  }

  async getBondedDeposits(account: string): Promise<Deposit[]> {
    return this.zipAccountTimesAndValuesToDeposits(
      account,
      this.contract.methods.getNoticePeriods,
      this.getBondedDepositValue.bind(this)
    )
  }

  async getNotifiedDepositValue(account: string, availTime: string): Promise<BigNumber> {
    const deposit = await this.contract.methods.getNotifiedDeposit(account, availTime).call()
    return this.getValueFromDeposit(deposit)
  }

  async getNotifiedDeposits(account: string): Promise<Deposit[]> {
    return this.zipAccountTimesAndValuesToDeposits(
      account,
      this.contract.methods.getAvailabilityTimes,
      this.getNotifiedDepositValue.bind(this)
    )
  }

  async getDeposits(account: string): Promise<Deposits> {
    const bonded = await this.getBondedDeposits(account)
    const notified = await this.getNotifiedDeposits(account)
    const weight = await this.getAccountWeight(account)

    const totalBonded = bonded.reduce((acc, bond) => acc.plus(bond.value), new BigNumber(0))
    const gold = bonded.reduce((acc, bond) => acc.plus(bond.value), totalBonded)

    return {
      bonded,
      notified,
      total: { weight, gold },
    }
  }

  // FIXME this.contract.methods.delegateRewards does not exist
  async delegateRewardsTx(account: string, delegate: string): Promise<CeloTransactionObject<void>> {
    const sig = await this.getParsedSignatureOfAddress(account, delegate)

    return wrapSend(
      this.kit,
      this.contract.methods.delegateRole(Roles.rewards, delegate, sig.v, sig.r, sig.s)
    )
  }

  private getValueFromDeposit(deposit: { 0: string; 1: string }) {
    return new BigNumber(deposit[0])
  }

  private async getParsedSignatureOfAddress(address: string, signer: string) {
    const hash = Web3.utils.soliditySha3({ type: 'address', value: address })
    const signature = (await this.kit.web3.eth.sign(hash, signer)).slice(2)
    return {
      r: `0x${signature.slice(0, 64)}`,
      s: `0x${signature.slice(64, 128)}`,
      v: Web3.utils.hexToNumber(signature.slice(128, 130)) + 27,
    }
  }

  private async zipAccountTimesAndValuesToDeposits(
    account: string,
    timesFunc: (account: string) => TransactionObject<string[]>,
    valueFunc: (account: string, time: string) => Promise<BigNumber>
  ) {
    const accountTimes = await timesFunc(account).call()
    const accountValues = await Promise.all(accountTimes.map((time) => valueFunc(account, time)))
    return zip(
      // tslint:disable-next-line: no-object-literal-type-assertion
      (time, value) => ({ time, value } as Deposit),
      accountTimes.map((time) => new BigNumber(time)),
      accountValues
    )
  }
}
