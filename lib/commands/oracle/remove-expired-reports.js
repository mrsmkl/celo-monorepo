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
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class RemoveExpiredReports extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(RemoveExpiredReports);
            this.kit.defaultAccount = res.flags.from;
            const sortedOracles = yield this.kit.contracts.getSortedOracles();
            const txo = yield sortedOracles.removeExpiredReports(res.args.token);
            yield cli_1.displaySendTx('removeExpiredReports', txo);
        });
    }
}
exports.default = RemoveExpiredReports;
RemoveExpiredReports.description = 'Remove expired oracle reports for a specified token (currently just Celo Dollar, aka: "StableToken")';
RemoveExpiredReports.args = [
    {
        name: 'token',
        required: true,
        default: contractkit_1.CeloContract.StableToken,
        description: 'Token to remove expired reports for',
        options: [contractkit_1.CeloContract.StableToken],
    },
];
RemoveExpiredReports.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({
        required: true,
        description: 'Address of the account removing oracle reports',
    }) });
RemoveExpiredReports.example = [
    'remove-expired-reports StableToken --from 0x8c349AAc7065a35B7166f2659d6C35D75A3893C1',
    'remove-expired-reports --from 0x8c349AAc7065a35B7166f2659d6C35D75A3893C1',
];
//# sourceMappingURL=remove-expired-reports.js.map