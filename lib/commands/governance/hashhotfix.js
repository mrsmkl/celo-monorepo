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
const proposals_1 = require("@celo/contractkit/lib/governance/proposals");
const address_1 = require("@celo/utils/lib/address");
const command_1 = require("@oclif/command");
const fs_extra_1 = require("fs-extra");
const base_1 = require("../../base");
const cli_1 = require("../../utils/cli");
class HashHotfix extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(HashHotfix);
            // Parse the transactions JSON file.
            const jsonString = fs_extra_1.readFileSync(res.flags.jsonTransactions).toString();
            const jsonTransactions = JSON.parse(jsonString);
            const builder = new proposals_1.ProposalBuilder(this.kit);
            jsonTransactions.forEach((tx) => builder.addJsonTx(tx));
            const hotfix = yield builder.build();
            // Combine with the salt and hash the proposal.
            const saltBuff = Buffer.from(address_1.trimLeading0x(res.flags.salt), 'hex');
            console.log(`salt: ${res.flags.salt}, buf: ${saltBuff.toString('hex')}`);
            const hash = proposals_1.hotfixToHash(this.kit, hotfix, saltBuff);
            // Print the hash to the console.
            cli_1.printValueMap({ hash: '0x' + hash.toString('hex') });
        });
    }
}
exports.default = HashHotfix;
HashHotfix.description = 'Hash a governance hotfix specified by JSON and a salt';
HashHotfix.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { jsonTransactions: command_1.flags.string({
        required: true,
        description: 'Path to json transactions of the hotfix',
    }), salt: command_1.flags.string({ required: true, description: 'Secret salt associated with hotfix' }) });
HashHotfix.examples = [
    'hashhotfix --jsonTransactions ./transactions.json --salt 0x614dccb5ac13cba47c2430bdee7829bb8c8f3603a8ace22e7680d317b39e3658',
];
//# sourceMappingURL=hashhotfix.js.map