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
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const release_gold_1 = require("./release-gold");
class RefundAndFinalize extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            const remainingLockedBalance = yield this.releaseGoldWrapper.getRemainingLockedBalance();
            yield checks_1.newCheckBuilder(this)
                .addCheck('Contract is revoked', () => isRevoked)
                .addCheck('All contract gold is unlocked', () => remainingLockedBalance.eq(0))
                .runChecks();
            this.kit.defaultAccount = yield this.releaseGoldWrapper.getReleaseOwner();
            yield cli_1.displaySendTx('refundAndFinalize', yield this.releaseGoldWrapper.refundAndFinalize());
        });
    }
}
exports.default = RefundAndFinalize;
RefundAndFinalize.description = "Refund the given contract's balance to the appopriate parties and destroy the contact. Can only be called by the release owner of revocable ReleaseGold instances.";
RefundAndFinalize.flags = Object.assign({}, release_gold_1.ReleaseGoldCommand.flags);
RefundAndFinalize.args = [];
RefundAndFinalize.examples = ['refund-and-finalize --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631'];
//# sourceMappingURL=refund-and-finalize.js.map