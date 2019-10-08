export enum CeloContractName {
  Attestations = 'Attestations',
  BlockchainParameters = 'BlockchainParameters',
  Escrow = 'Escrow',
  Exchange = 'Exchange',
  GasCurrencyWhitelist = 'GasCurrencyWhitelist',
  GasPriceMinimum = 'GasPriceMinimum',
  GoldToken = 'GoldToken',
  Governance = 'Governance',
  LockedGold = 'LockedGold',
  Random = 'Random',
  Reserve = 'Reserve',
  SortedOracles = 'SortedOracles',
  StableToken = 'StableToken',
  Validators = 'Validators',
  BlockchainParameters = 'BlockchainParameters',
}

// TODO(amy): Pull this list from the build artifacts instead
export const usesRegistry = [
  CeloContractName.Escrow,
  CeloContractName.Reserve,
  CeloContractName.StableToken,
]

// TODO(amy): Find another way to create this list
export const hasEntryInRegistry: string[] = [
  CeloContractName.Attestations,
  CeloContractName.BlockchainParameters,
  CeloContractName.Escrow,
  CeloContractName.Exchange,
  CeloContractName.GoldToken,
  CeloContractName.GasCurrencyWhitelist,
  CeloContractName.GasPriceMinimum,
  CeloContractName.SortedOracles,
  CeloContractName.StableToken,
  CeloContractName.Random,
  CeloContractName.Reserve,
  CeloContractName.BlockchainParameters,
]
