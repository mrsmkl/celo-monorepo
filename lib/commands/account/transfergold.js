"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class GoldTransfer extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(GoldTransfer);
            const from = res.flags.from;
            const to = res.flags.to;
            const amountInWei = new bignumber_js_1.default(res.flags.amountInWei);
            this.kit.defaultAccount = from;
            // Units of all balances are in wei, unless specified.
            // Check the balance before
            const goldToken = yield this.kit.contracts.getGoldToken();
            // Check the balance before
            const balanceFromBeforeInWei = yield goldToken.balanceOf(from);
            // Perform the transfer
            yield cli_1.displaySendTx('gold.Transfer', goldToken.transfer(to, amountInWei.toString()));
            // Check the balance after
            const balanceFromAfterInWei = yield goldToken.balanceOf(from);
            // Get gas cost
            const differenceInWei = balanceFromBeforeInWei.minus(balanceFromAfterInWei);
            const gasCostInWei = differenceInWei.minus(amountInWei);
            this.log(`Transferred ${amountInWei} from ${from} to ${to}, gas cost: ${gasCostInWei.toString()} wei`);
            this.log(`Balance of sender ${from} went down by ${differenceInWei.toString()} wei, final balance: ${balanceFromAfterInWei} Celo Gold wei`);
        });
    }
}
GoldTransfer.description = 'Transfer gold';
GoldTransfer.flags = Object.assign({}, base_1.BaseCommand.flags, { from: command_2.Flags.address({ required: true, description: 'Address of the sender' }), to: command_2.Flags.address({ required: true, description: 'Address of the receiver' }), amountInWei: command_1.flags.string({ required: true, description: 'Amount to transfer (in wei)' }) });
GoldTransfer.examples = [
    'transfergold --from 0xa0Af2E71cECc248f4a7fD606F203467B500Dd53B --to 0x5409ed021d9299bf6814279a6a1411a7e866a631 --amountInWei 1',
];
exports.default = GoldTransfer;
//# sourceMappingURL=transfergold.js.map