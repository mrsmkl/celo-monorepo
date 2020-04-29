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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
const release_gold_1 = require("./release-gold");
class LockedGold extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(LockedGold);
            const value = new bignumber_js_1.default(flags.value);
            const checkBuilder = checks_1.newCheckBuilder(this, this.contractAddress).isAccount(this.contractAddress);
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            const beneficiary = yield this.releaseGoldWrapper.getBeneficiary();
            const releaseOwner = yield this.releaseGoldWrapper.getReleaseOwner();
            const lockedGold = yield this.kit.contracts.getLockedGold();
            this.kit.defaultAccount = isRevoked ? releaseOwner : beneficiary;
            if (flags.action === 'lock') {
                // Must verify contract is account before checking pending withdrawals
                yield checkBuilder.addCheck('Is not revoked', () => !isRevoked).runChecks();
                const pendingWithdrawalsValue = yield lockedGold.getPendingWithdrawalsTotalValue(this.contractAddress);
                const relockValue = bignumber_js_1.default.minimum(pendingWithdrawalsValue, value);
                const lockValue = value.minus(relockValue);
                yield checks_1.newCheckBuilder(this, this.contractAddress)
                    .hasEnoughGold(this.contractAddress, lockValue)
                    .runChecks();
                const txos = yield this.releaseGoldWrapper.relockGold(relockValue);
                for (const txo of txos) {
                    yield cli_1.displaySendTx('lockedGoldRelock', txo, { from: beneficiary });
                }
                if (lockValue.gt(new bignumber_js_1.default(0))) {
                    yield cli_1.displaySendTx('lockedGoldLock', this.releaseGoldWrapper.lockGold(lockValue));
                }
            }
            else if (flags.action === 'unlock') {
                yield checkBuilder
                    .isNotVoting(this.contractAddress)
                    .hasEnoughLockedGoldToUnlock(value)
                    .runChecks();
                yield cli_1.displaySendTx('lockedGoldUnlock', this.releaseGoldWrapper.unlockGold(flags.value));
            }
            else if (flags.action === 'withdraw') {
                yield checkBuilder.runChecks();
                const currentTime = Math.round(new Date().getTime() / 1000);
                while (true) {
                    let madeWithdrawal = false;
                    const pendingWithdrawals = yield lockedGold.getPendingWithdrawals(this.contractAddress);
                    for (let i = 0; i < pendingWithdrawals.length; i++) {
                        const pendingWithdrawal = pendingWithdrawals[i];
                        if (pendingWithdrawal.time.isLessThan(currentTime)) {
                            console.log(`Found available pending withdrawal of value ${pendingWithdrawal.value.toFixed()}, withdrawing`);
                            yield cli_1.displaySendTx('lockedGoldWithdraw', this.releaseGoldWrapper.withdrawLockedGold(i));
                            madeWithdrawal = true;
                            break;
                        }
                    }
                    if (!madeWithdrawal)
                        break;
                }
                const remainingPendingWithdrawals = yield lockedGold.getPendingWithdrawals(this.contractAddress);
                for (const pendingWithdrawal of remainingPendingWithdrawals) {
                    console.log(`Pending withdrawal of value ${pendingWithdrawal.value.toFixed()} available for withdrawal in ${pendingWithdrawal.time
                        .minus(currentTime)
                        .toFixed()} seconds.`);
                }
            }
        });
    }
}
exports.default = LockedGold;
LockedGold.description = 'Perform actions [lock, unlock, withdraw] on Celo Gold that has been locked via the provided ReleaseGold contract.';
LockedGold.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { action: command_1.flags.string({
        char: 'a',
        options: ['lock', 'unlock', 'withdraw'],
        description: "Action to perform on contract's gold",
        required: true,
    }), value: command_2.Flags.wei({ required: true, description: 'Amount of gold to perform `action` with' }) });
LockedGold.examples = [
    'locked-gold --contract 0xCcc8a47BE435F1590809337BB14081b256Ae26A8 --action lock --value 10000000000000000000000',
    'locked-gold --contract 0xCcc8a47BE435F1590809337BB14081b256Ae26A8 --action unlock --value 10000000000000000000000',
    'locked-gold --contract 0xCcc8a47BE435F1590809337BB14081b256Ae26A8 --action withdraw --value 10000000000000000000000',
];
//# sourceMappingURL=locked-gold.js.map