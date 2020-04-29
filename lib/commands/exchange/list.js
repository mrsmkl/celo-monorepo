"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
class List extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { flags: parsedFlags } = this.parse(List);
            cli_ux_1.cli.action.start('Fetching exchange rates...');
            const exchange = yield this.kit.contracts.getExchange();
            const dollarForGold = yield exchange.getBuyTokenAmount(parsedFlags.amount, true);
            const goldForDollar = yield exchange.getBuyTokenAmount(parsedFlags.amount, false);
            cli_ux_1.cli.action.stop();
            this.log(`${parsedFlags.amount} cGLD => ${dollarForGold.toString()} cUSD`);
            this.log(`${parsedFlags.amount} cUSD => ${goldForDollar.toString()} cGLD`);
        });
    }
}
List.description = 'List information about tokens on the exchange (all amounts in wei)';
List.flags = Object.assign({}, base_1.BaseCommand.flags, { amount: command_1.flags.string({
        description: 'Amount of sellToken (in wei) to report rates for',
        default: '1000000000000000000',
    }) });
List.args = [];
List.examples = ['list'];
exports.default = List;
//# sourceMappingURL=list.js.map