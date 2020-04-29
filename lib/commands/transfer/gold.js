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
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class TransferGold extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(TransferGold);
            const from = res.flags.from;
            const to = res.flags.to;
            const value = new bignumber_js_1.default(res.flags.value);
            this.kit.defaultAccount = from;
            const goldToken = yield this.kit.contracts.getGoldToken();
            yield cli_1.displaySendTx('transfer', goldToken.transfer(to, value.toFixed()));
        });
    }
}
exports.default = TransferGold;
TransferGold.description = 'Transfer Celo Gold to a specified address.';
TransferGold.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: 'Address of the sender' }), to: command_2.Flags.address({ required: true, description: 'Address of the receiver' }), value: command_1.flags.string({ required: true, description: 'Amount to transfer (in wei)' }) });
TransferGold.examples = [
    'gold --from 0xa0Af2E71cECc248f4a7fD606F203467B500Dd53B --to 0x5409ed021d9299bf6814279a6a1411a7e866a631 --value 10000000000000000000',
];
//# sourceMappingURL=gold.js.map