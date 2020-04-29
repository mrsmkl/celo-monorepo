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
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class Withdraw extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(Withdraw);
            this.kit.defaultAccount = flags.from;
            const lockedgold = yield this.kit.contracts.getLockedGold();
            yield checks_1.newCheckBuilder(this)
                .isAccount(flags.from)
                .runChecks();
            const currentTime = Math.round(new Date().getTime() / 1000);
            while (true) {
                let madeWithdrawal = false;
                const pendingWithdrawals = yield lockedgold.getPendingWithdrawals(flags.from);
                for (let i = 0; i < pendingWithdrawals.length; i++) {
                    const pendingWithdrawal = pendingWithdrawals[i];
                    if (pendingWithdrawal.time.isLessThan(currentTime)) {
                        console.log(`Found available pending withdrawal of value ${pendingWithdrawal.value.toFixed()}, withdrawing`);
                        yield cli_1.displaySendTx('withdraw', lockedgold.withdraw(i));
                        madeWithdrawal = true;
                        break;
                    }
                }
                if (!madeWithdrawal) {
                    break;
                }
            }
            const remainingPendingWithdrawals = yield lockedgold.getPendingWithdrawals(flags.from);
            for (const pendingWithdrawal of remainingPendingWithdrawals) {
                console.log(`Pending withdrawal of value ${pendingWithdrawal.value.toFixed()} available for withdrawal in ${pendingWithdrawal.time
                    .minus(currentTime)
                    .toFixed()} seconds.`);
            }
        });
    }
}
exports.default = Withdraw;
Withdraw.description = 'Withdraw any pending withdrawals created via "lockedgold:unlock" that have become available.';
Withdraw.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true }) });
Withdraw.examples = ['withdraw --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95'];
//# sourceMappingURL=withdraw.js.map