import { EpochRewards } from '../generated/EpochRewards';
import { BaseWrapper } from './BaseWrapper';
/**
 * Contract for handling reserve for stable currencies
 */
export declare class EpochRewardsWrapper extends BaseWrapper<EpochRewards> {
    getRewardsMultiplier: () => Promise<string>;
    getTargetGoldTotalSupply: () => Promise<string>;
}
