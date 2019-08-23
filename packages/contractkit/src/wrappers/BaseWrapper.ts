import { zip } from '@celo/utils/lib/src/collections'
import BigNumber from 'bignumber.js'
import Contract from 'web3/eth/contract'
import { TransactionObject } from 'web3/eth/types'
import { ContractKit } from '../kit'
import { TxOptions } from '../utils/send-tx'
import { TransactionResult } from '../utils/tx-result'

type Method<I extends any[], O> = (...args: I) => TransactionObject<O>

export abstract class BaseWrapper<T extends Contract> {
  constructor(protected readonly kit: ContractKit, protected readonly contract: T) {}

  get address(): string {
    // TODO fix typings
    return (this.contract as any)._address
  }
}

export interface CeloTransactionObject<O> {
  txo: TransactionObject<O>
  send(options?: TxOptions): Promise<TransactionResult>
}

export function toBigNumber(input: string) {
  return new BigNumber(input)
}

export function toNumber(input: string) {
  return parseInt(input, 10)
}

export function parseNumber(input: string | number | BigNumber) {
  return new BigNumber(input).toString()
}

type Parser<A, B> = (input: A) => B

export function tupleParser<A0, B0>(parser0: Parser<A0, B0>): (...args: [A0]) => [B0]
export function tupleParser<A0, B0, A1, B1>(
  parser0: Parser<A0, B0>,
  parser1: Parser<A1, B1>
): (...args: [A0, A1]) => [B0, B1]
export function tupleParser<A0, B0, A1, B1, A2, B2>(
  parser0: Parser<A0, B0>,
  parser1: Parser<A1, B1>,
  parser2: Parser<A2, B2>
): (...args: [A0, A1, A2]) => [B0, B1, B2]
export function tupleParser<A0, B0, A1, B1, A2, B2, A3, B3>(
  parser0: Parser<A0, B0>,
  parser1: Parser<A1, B1>,
  parser2: Parser<A2, B2>,
  parser3: Parser<A3, B3>
): (...args: [A0, A1, A2, A3]) => [B0, B1, B2, B3]
export function tupleParser(...parsers: Array<Parser<any, any>>) {
  return (...args: any[]) => zip((parser, input) => parser(input), parsers, args)
}

type ProxyCallArgs<A extends any[], B extends any[], C, D> =
  | [Method<B, C>, (...arg: A) => B, (arg: C) => D]
  | [Method<A, C>, undefined, (arg: C) => D]
  | [Method<B, D>, (...arg: A) => B]
  | [Method<A, D>]

export function proxyCall<A extends any[], B extends any[], C, D>(
  ...callArgs: ProxyCallArgs<A, B, C, D>
) {
  if (callArgs.length === 3 && callArgs[1] != null) {
    const methodFn = callArgs[0]
    const preParse = callArgs[1]
    const postParse = callArgs[2]
    return (...args: A) =>
      methodFn(...preParse(...args))
        .call()
        .then(postParse)
  } else if (callArgs.length === 3) {
    const methodFn = callArgs[0]
    const postParse = callArgs[2]
    return (...args: A) =>
      methodFn(...args)
        .call()
        .then(postParse)
  } else if (callArgs.length === 2) {
    const methodFn = callArgs[0]
    const preParse = callArgs[1]
    return (...args: A) => methodFn(...preParse(...args)).call()
  } else {
    const methodFn = callArgs[0]
    return (...args: A) => methodFn(...args).call()
  }
}

type ProxySendArgs<A extends any[], B extends any[], C> =
  | [Method<B, C>, (...arg: A) => B]
  | [Method<A, C>]

export function proxySend<A extends any[], B extends any[], C>(
  kit: ContractKit,
  ...sendArgs: ProxySendArgs<A, B, C>
) {
  if (sendArgs.length === 2) {
    const methodFn = sendArgs[0]
    const preParse = sendArgs[1]
    return (...args: A) => wrapSend(kit, methodFn(...preParse(...args)))
  } else {
    const methodFn = sendArgs[0]
    return (...args: A) => wrapSend(kit, methodFn(...args))
  }
}

export function wrapSend<O>(kit: ContractKit, txo: TransactionObject<O>): CeloTransactionObject<O> {
  return {
    send: (options?: TxOptions) => kit.sendTransactionObject(txo, options),
    txo,
  }
}
