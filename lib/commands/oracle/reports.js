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
class Reports extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Reports);
            const sortedOracles = yield this.kit.contracts.getSortedOracles();
            const reports = yield sortedOracles.getReports(res.args.token);
            cli_ux_1.cli.table(reports, {
                address: {},
                rate: { get: (r) => r.rate.toNumber() },
                timestamp: { get: (r) => r.timestamp.toNumber() },
            }, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = Reports;
Reports.description = 'List oracle reports for a given token';
Reports.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
Reports.args = [
    {
        name: 'token',
        required: true,
        description: 'Token to list the reports for',
        options: [contractkit_1.CeloContract.StableToken],
        default: contractkit_1.CeloContract.StableToken,
    },
];
Reports.example = ['reports StableToken', 'reports'];
//# sourceMappingURL=reports.js.map