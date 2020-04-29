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
const contractkit_1 = require("@celo/contractkit");
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
class GetRates extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(GetRates);
            const sortedOracles = yield this.kit.contracts.getSortedOracles();
            const rates = yield sortedOracles.getRates(res.args.token);
            cli_ux_1.cli.table(rates, {
                address: {},
                rate: { get: (r) => r.rate.toNumber() },
            }, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = GetRates;
GetRates.description = 'Get the current set oracle-reported rates for the given token';
GetRates.flags = Object.assign({}, base_1.BaseCommand.flags);
GetRates.args = [
    {
        name: 'token',
        required: true,
        description: 'Token to get the rates for',
        options: [contractkit_1.CeloContract.StableToken],
        default: contractkit_1.CeloContract.StableToken,
    },
];
GetRates.example = ['rates StableToken', 'rates'];
//# sourceMappingURL=rates.js.map