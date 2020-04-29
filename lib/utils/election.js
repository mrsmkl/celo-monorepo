"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("@celo/utils/lib/address");
const istanbul_1 = require("@celo/utils/lib/istanbul");
/**
 * Cache to efficiently retreive the elected validators for many blocks within an epoch.
 */
class ElectionResultsCache {
    constructor(election, epochSize) {
        this.election = election;
        this.epochSize = epochSize;
        this.cache = new Map();
    }
    /**
     * Returns the list of elected signers for a given block.
     * @param blockNumber The block number to get elected signers for.
     */
    electedSigners(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const epoch = this.epochNumber(blockNumber);
            const cached = this.cache.get(epoch);
            if (cached) {
                return cached;
            }
            // For the first epoch, the contract might be unavailable
            const electedSigners = yield this.election.getCurrentValidatorSigners(epoch === 1 ? blockNumber : this.firstBlockOfEpoch(epoch));
            this.cache.set(epoch, electedSigners);
            return electedSigners;
        });
    }
    /**
     * Returns true if the given signer is elected at the given block number.
     * @param signer Validator signer address to check if elected.
     * @param blockNumber The block number to check the election status at.
     */
    elected(signer, blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const electedSigners = yield this.electedSigners(blockNumber);
            return electedSigners.some(address_1.eqAddress.bind(null, signer));
        });
    }
    /**
     * Returns true if the given signer is present in the parent aggregated seal of the given block.
     * @param signer Validator signer address to check if present in the block.
     * @param block The block to check for a signature on.
     */
    signedParent(signer, block) {
        return __awaiter(this, void 0, void 0, function* () {
            const electedSigners = yield this.electedSigners(block.number);
            const signerIndex = electedSigners.map(address_1.eqAddress.bind(null, signer)).indexOf(true);
            if (signerIndex < 0) {
                return false;
            }
            const bitmap = istanbul_1.parseBlockExtraData(block.extraData).parentAggregatedSeal.bitmap;
            return istanbul_1.bitIsSet(bitmap, signerIndex);
        });
    }
    epochNumber(blockNumber) {
        return Math.ceil(blockNumber / this.epochSize);
    }
    firstBlockOfEpoch(epochNumber) {
        return (epochNumber - 1) * this.epochSize + 1;
    }
}
exports.ElectionResultsCache = ElectionResultsCache;
//# sourceMappingURL=election.js.map