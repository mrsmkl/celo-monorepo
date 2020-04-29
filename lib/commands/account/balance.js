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
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class Balance extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { args } = this.parse(Balance);
            console.log('All balances expressed in units of 10^-18.');
            cli_1.printValueMap(yield this.kit.getTotalBalance(args.address));
        });
    }
}
exports.default = Balance;
Balance.description = 'View Celo Dollar and Gold balances for an address';
Balance.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
Balance.args = [command_1.Args.address('address')];
Balance.examples = ['balance 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
//# sourceMappingURL=balance.js.map