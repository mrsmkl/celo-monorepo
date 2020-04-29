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
const cli_1 = require("../../utils/cli");
const release_gold_1 = require("./release-gold");
class Show extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const balanceStateData = {
                totalWithdrawn: (yield this.releaseGoldWrapper.getTotalWithdrawn()).toString(),
                maxDistribution: (yield this.releaseGoldWrapper.getMaxDistribution()).toString(),
                totalBalance: (yield this.releaseGoldWrapper.getTotalBalance()).toString(),
                remainingTotalBalance: (yield this.releaseGoldWrapper.getRemainingTotalBalance()).toString(),
                remainingUnlockedBalance: (yield this.releaseGoldWrapper.getRemainingUnlockedBalance()).toString(),
                remainingLockedBalance: (yield this.releaseGoldWrapper.getRemainingLockedBalance()).toString(),
                currentReleasedTotalAmount: (yield this.releaseGoldWrapper.getCurrentReleasedTotalAmount()).toString(),
            };
            const releaseGoldInfo = {
                releaseGoldWrapperAddress: this.releaseGoldWrapper.address,
                beneficiary: yield this.releaseGoldWrapper.getBeneficiary(),
                releaseOwner: yield this.releaseGoldWrapper.getReleaseOwner(),
                refundAddress: yield this.releaseGoldWrapper.getRefundAddress(),
                liquidityProvisionMet: yield this.releaseGoldWrapper.getLiquidityProvisionMet(),
                canValidate: yield this.releaseGoldWrapper.getCanValidate(),
                canVote: yield this.releaseGoldWrapper.getCanVote(),
                releaseSchedule: yield this.releaseGoldWrapper.getReleaseSchedule(),
                isRevoked: yield this.releaseGoldWrapper.isRevoked(),
                revokedStateData: yield this.releaseGoldWrapper.getRevocationInfo(),
                balanceStateData: balanceStateData,
            };
            cli_1.printValueMapRecursive(releaseGoldInfo);
        });
    }
}
exports.default = Show;
Show.description = 'Show info on a ReleaseGold instance contract.';
Show.flags = Object.assign({}, release_gold_1.ReleaseGoldCommand.flags);
Show.examples = ['show --contract 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95'];
//# sourceMappingURL=show.js.map