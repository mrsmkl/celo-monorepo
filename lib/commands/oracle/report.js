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
const contractkit_1 = require("@celo/contractkit");
const command_1 = require("@oclif/command");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ReportPrice extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ReportPrice);
            const sortedOracles = yield this.kit.contracts.getSortedOracles();
            const value = new bignumber_js_1.default(res.flags.value);
            yield cli_1.displaySendTx('sortedOracles.report', yield sortedOracles.report(res.args.token, value, res.flags.from));
            this.log(`Reported oracle value: ${value.toString} ${res.args.token} == 1 cGLD`);
        });
    }
}
exports.default = ReportPrice;
ReportPrice.description = 'Report the price of Celo Gold in a specified token (currently just Celo Dollar, aka: "StableToken")';
ReportPrice.args = [
    {
        name: 'token',
        required: true,
        default: contractkit_1.CeloContract.StableToken,
        description: 'Token to report on',
        options: [contractkit_1.CeloContract.StableToken],
    },
];
ReportPrice.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: 'Address of the oracle account' }), value: command_1.flags.string({
        required: true,
        description: 'Amount of the specified token equal to 1 cGLD',
    }) });
ReportPrice.example = [
    'report StableToken --value 1.02 --from 0x8c349AAc7065a35B7166f2659d6C35D75A3893C1',
    'report --value 0.99 --from 0x8c349AAc7065a35B7166f2659d6C35D75A3893C1',
];
//# sourceMappingURL=report.js.map