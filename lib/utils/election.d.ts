import { Address } from '@celo/contractkit';
import { Block } from 'web3-eth';
/**
 * Cache to efficiently retreive the elected validators for many blocks within an epoch.
 */
export declare class ElectionResultsCache {
    private readonly election;
    private readonly epochSize;
    private readonly cache;
    constructor(election: any, epochSize: number);
    /**
     * Returns the list of elected signers for a given block.
     * @param blockNumber The block number to get elected signers for.
     */
    electedSigners(blockNumber: number): Promise<Address[]>;
    /**
     * Returns true if the given signer is elected at the given block number.
     * @param signer Validator signer address to check if elected.
     * @param blockNumber The block number to check the election status at.
     */
    elected(signer: Address, blockNumber: number): Promise<boolean>;
    /**
     * Returns true if the given signer is present in the parent aggregated seal of the given block.
     * @param signer Validator signer address to check if present in the block.
     * @param block The block to check for a signature on.
     */
    signedParent(signer: Address, block: Block): Promise<boolean>;
    private epochNumber;
    private firstBlockOfEpoch;
}
