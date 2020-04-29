import { Random } from '../generated/types/Random';
import { BaseWrapper } from './BaseWrapper';
/**
 * Currency price oracle contract.
 */
export declare class RandomWrapper extends BaseWrapper<Random> {
    /**
     * Returns the current randomness value
     * @returns Current randomness value.
     */
    random: () => Promise<string>;
}
