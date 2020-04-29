import { CeloContract } from './base';
import { ContractKit } from './kit';
import { AccountsWrapper } from './wrappers/Accounts';
import { AttestationsWrapper } from './wrappers/Attestations';
import { BlockchainParametersWrapper } from './wrappers/BlockchainParameters';
import { DoubleSigningSlasherWrapper } from './wrappers/DoubleSigningSlasher';
import { DowntimeSlasherWrapper } from './wrappers/DowntimeSlasher';
import { ElectionWrapper } from './wrappers/Election';
import { EscrowWrapper } from './wrappers/Escrow';
import { ExchangeWrapper } from './wrappers/Exchange';
import { FreezerWrapper } from './wrappers/Freezer';
import { GasPriceMinimumWrapper } from './wrappers/GasPriceMinimum';
import { GoldTokenWrapper } from './wrappers/GoldTokenWrapper';
import { GovernanceWrapper } from './wrappers/Governance';
import { LockedGoldWrapper } from './wrappers/LockedGold';
import { MultiSigWrapper } from './wrappers/MultiSig';
import { ReserveWrapper } from './wrappers/Reserve';
import { SortedOraclesWrapper } from './wrappers/SortedOracles';
import { StableTokenWrapper } from './wrappers/StableTokenWrapper';
import { ValidatorsWrapper } from './wrappers/Validators';
declare const WrapperFactories: {
    [CeloContract.Accounts]: typeof AccountsWrapper;
    [CeloContract.Attestations]: typeof AttestationsWrapper;
    [CeloContract.BlockchainParameters]: typeof BlockchainParametersWrapper;
    [CeloContract.DoubleSigningSlasher]: typeof DoubleSigningSlasherWrapper;
    [CeloContract.DowntimeSlasher]: typeof DowntimeSlasherWrapper;
    [CeloContract.Election]: typeof ElectionWrapper;
    [CeloContract.Escrow]: typeof EscrowWrapper;
    [CeloContract.Exchange]: typeof ExchangeWrapper;
    [CeloContract.Freezer]: typeof FreezerWrapper;
    [CeloContract.GasPriceMinimum]: typeof GasPriceMinimumWrapper;
    [CeloContract.GoldToken]: typeof GoldTokenWrapper;
    [CeloContract.Governance]: typeof GovernanceWrapper;
    [CeloContract.LockedGold]: typeof LockedGoldWrapper;
    [CeloContract.MultiSig]: typeof MultiSigWrapper;
    [CeloContract.Reserve]: typeof ReserveWrapper;
    [CeloContract.SortedOracles]: typeof SortedOraclesWrapper;
    [CeloContract.StableToken]: typeof StableTokenWrapper;
    [CeloContract.Validators]: typeof ValidatorsWrapper;
};
declare type CFType = typeof WrapperFactories;
export declare type ValidWrappers = keyof CFType;
interface WrapperCacheMap {
    [CeloContract.Accounts]?: AccountsWrapper;
    [CeloContract.Attestations]?: AttestationsWrapper;
    [CeloContract.BlockchainParameters]?: BlockchainParametersWrapper;
    [CeloContract.DoubleSigningSlasher]?: DoubleSigningSlasherWrapper;
    [CeloContract.DowntimeSlasher]?: DowntimeSlasherWrapper;
    [CeloContract.Election]?: ElectionWrapper;
    [CeloContract.Escrow]?: EscrowWrapper;
    [CeloContract.Exchange]?: ExchangeWrapper;
    [CeloContract.Freezer]?: FreezerWrapper;
    [CeloContract.GasPriceMinimum]?: GasPriceMinimumWrapper;
    [CeloContract.GoldToken]?: GoldTokenWrapper;
    [CeloContract.Governance]?: GovernanceWrapper;
    [CeloContract.LockedGold]?: LockedGoldWrapper;
    [CeloContract.MultiSig]?: MultiSigWrapper;
    [CeloContract.Reserve]?: ReserveWrapper;
    [CeloContract.SortedOracles]?: SortedOraclesWrapper;
    [CeloContract.StableToken]?: StableTokenWrapper;
    [CeloContract.Validators]?: ValidatorsWrapper;
}
/**
 * Kit ContractWrappers factory & cache.
 *
 * Provides access to all contract wrappers for celo core contracts
 */
export declare class WrapperCache {
    readonly kit: ContractKit;
    private wrapperCache;
    constructor(kit: ContractKit);
    getAccounts(): Promise<AccountsWrapper>;
    getAttestations(): Promise<AttestationsWrapper>;
    getBlockchainParameters(): Promise<BlockchainParametersWrapper>;
    getDoubleSigningSlasher(): Promise<DoubleSigningSlasherWrapper>;
    getDowntimeSlasher(): Promise<DowntimeSlasherWrapper>;
    getElection(): Promise<ElectionWrapper>;
    getEscrow(): Promise<EscrowWrapper>;
    getExchange(): Promise<ExchangeWrapper>;
    getFreezer(): Promise<FreezerWrapper>;
    getGasPriceMinimum(): Promise<GasPriceMinimumWrapper>;
    getGoldToken(): Promise<GoldTokenWrapper>;
    getGovernance(): Promise<GovernanceWrapper>;
    getLockedGold(): Promise<LockedGoldWrapper>;
    getMultiSig(address: string): Promise<MultiSigWrapper>;
    getReserve(): Promise<ReserveWrapper>;
    getSortedOracles(): Promise<SortedOraclesWrapper>;
    getStableToken(): Promise<StableTokenWrapper>;
    getValidators(): Promise<ValidatorsWrapper>;
    /**
     * Get Contract wrapper
     */
    getContract<C extends ValidWrappers>(contract: C, address?: string): Promise<NonNullable<WrapperCacheMap[C]>>;
}
export {};
