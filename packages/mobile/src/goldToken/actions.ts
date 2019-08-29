import { TokenTransfer, TokenTransferAction } from 'src/tokens/saga'

export enum Actions {
  SET_BALANCE = 'GOLD/SET_BALANCE',
  FETCH_BALANCE = 'GOLD/FETCH_BALANCE',
  TRANSFER = 'GOLD/TRANSFER',
}

export interface SetBalanceAction {
  type: Actions.SET_BALANCE
  balance: string
}

export interface FetchBalanceAction {
  type: Actions.FETCH_BALANCE
}

export type TransferAction = {
  type: Actions.TRANSFER
} & TokenTransferAction

export type ActionTypes = SetBalanceAction | FetchBalanceAction | TransferAction

export const fetchGoldBalance = (): FetchBalanceAction => ({
  type: Actions.FETCH_BALANCE,
})

export const setBalance = (balance: string): SetBalanceAction => ({
  type: Actions.SET_BALANCE,
  balance,
})

export const transferGoldToken = ({
  recipientAddress,
  amount,
  comment,
  txId,
}: TokenTransfer): TransferAction => ({
  type: Actions.TRANSFER,
  recipientAddress,
  amount,
  comment,
  txId,
})
