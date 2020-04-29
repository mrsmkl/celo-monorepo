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
const command_1 = require("../../utils/command");
const release_gold_1 = require("./release-gold");
class Withdraw extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(Withdraw);
            const value = flags.value;
            const remainingUnlockedBalance = yield this.releaseGoldWrapper.getRemainingUnlockedBalance();
            const maxDistribution = yield this.releaseGoldWrapper.getMaxDistribution();
            const totalWithdrawn = yield this.releaseGoldWrapper.getTotalWithdrawn();
            yield checks_1.newCheckBuilder(this)
                .addCheck('Value does not exceed available unlocked gold', () => value.lte(remainingUnlockedBalance))
                .addCheck('Value would not exceed maximum distribution', () => value.plus(totalWithdrawn).lte(maxDistribution))
                .addCheck('Contract has met liquidity provision if applicable', () => this.releaseGoldWrapper.getLiquidityProvisionMet())
                .runChecks();
            this.kit.defaultAccount = yield this.releaseGoldWrapper.getBeneficiary();
            yield cli_1.displaySendTx('withdrawTx', this.releaseGoldWrapper.withdraw(value.toNumber()));
        });
    }
}
exports.default = Withdraw;
Withdraw.description = 'Withdraws `value` released gold to the beneficiary address. Fails if `value` worth of gold has not been released yet.';
Withdraw.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { value: command_1.Flags.wei({
        required: true,
        description: 'Amount of released gold (in wei) to withdraw',
    }) });
Withdraw.args = [];
Withdraw.examples = [
    'withdraw --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631 --value 10000000000000000000000',
];
//# sourceMappingURL=withdraw.js.map