import { AccountAndBalance, ConsensusType, Validator } from '../generate_utils'

export interface GenesisConfig {
  validators?: Validator[]
  numValidators?: number
  consensusType?: ConsensusType
  initialAccounts?: AccountAndBalance[]
  blockTime?: number
  epoch?: number
  lookbackwindow?: number
  chainId?: number
  requestTimeout?: number
  enablePetersburg?: boolean
}
