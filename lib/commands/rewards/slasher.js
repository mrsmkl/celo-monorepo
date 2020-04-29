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
// Not intended for publication.  Used only as scaffolding to develop contractkit.
const address_1 = require("@celo/utils/lib/address");
const async_1 = require("@celo/utils/lib/async");
const istanbul_1 = require("@celo/utils/lib/istanbul");
const base_1 = require("../../base");
class Slasher extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.parse(Slasher);
            const validators = yield this.kit.contracts.getValidators();
            const downtimeSlasher = yield this.kit.contracts.getDowntimeSlasher();
            const slashableDowntime = yield downtimeSlasher.slashableDowntime();
            let validatorDownSince = [];
            let blockNumber = (yield this.kit.web3.eth.getBlockNumber()) - 1;
            let epochNumber = -2;
            while (true) {
                const newBlockNumber = yield this.kit.web3.eth.getBlockNumber();
                while (blockNumber < newBlockNumber) {
                    blockNumber++;
                    const newEpochNumber = yield this.kit.getEpochNumberOfBlock(blockNumber);
                    if (epochNumber !== newEpochNumber) {
                        epochNumber = newEpochNumber;
                        console.info(`New epoch: ${epochNumber}`);
                        const oldEpochSigners = yield validators.getValidatorSignerAddressSet(blockNumber - 1);
                        const newEpochSigners = yield validators.getValidatorSignerAddressSet(blockNumber);
                        validatorDownSince = yield address_1.mapAddressListDataOnto(validatorDownSince, oldEpochSigners, newEpochSigners, -1);
                    }
                    const block = yield this.kit.web3.eth.getBlock(blockNumber);
                    console.info(`New block: ${blockNumber}`);
                    const istanbulExtra = istanbul_1.parseBlockExtraData(block.extraData);
                    const round = istanbulExtra.aggregatedSeal.round.toNumber();
                    console.info(`Round: ${round}`);
                    for (let i = 0; i < validatorDownSince.length; i++) {
                        const validatorUp = istanbul_1.bitIsSet(istanbulExtra.aggregatedSeal.bitmap, i);
                        if (validatorUp) {
                            if (validatorDownSince[i] >= 0) {
                                validatorDownSince[i] = -1;
                            }
                        }
                        else {
                            if (validatorDownSince[i] < 0) {
                                validatorDownSince[i] = blockNumber;
                            }
                            else if (blockNumber - validatorDownSince[i] >= slashableDowntime) {
                                validatorDownSince[i] = -1;
                                console.info(`Slashing signer index ${i} for downtime through block ${blockNumber}`);
                                yield downtimeSlasher.slashEndSignerIndex(blockNumber, i);
                            }
                        }
                    }
                }
                yield async_1.sleep(1);
            }
        });
    }
}
exports.default = Slasher;
Slasher.description = 'Mines for slashable downtime';
Slasher.flags = Object.assign({}, base_1.BaseCommand.flags);
Slasher.args = [];
Slasher.examples = ['slasher'];
//# sourceMappingURL=slasher.js.map