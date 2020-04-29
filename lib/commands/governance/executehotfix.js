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
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ExecuteHotfix extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ExecuteHotfix);
            const account = res.flags.from;
            this.kit.defaultAccount = account;
            const jsonString = fs_extra_1.readFileSync(res.flags.jsonTransactions).toString();
            const jsonTransactions = JSON.parse(jsonString);
            const builder = new proposals_1.ProposalBuilder(this.kit);
            jsonTransactions.forEach((tx) => builder.addJsonTx(tx));
            const hotfix = yield builder.build();
            const saltBuff = address_1.hexToBuffer(res.flags.salt);
            const hash = proposals_1.hotfixToHash(this.kit, hotfix, saltBuff);
            const governance = yield this.kit.contracts.getGovernance();
            const record = yield governance.getHotfixRecord(hash);
            yield checks_1.newCheckBuilder(this, account)
                .hotfixIsPassing(hash)
                .hotfixNotExecuted(hash)
                .addCheck(`Hotfix 0x${hash.toString('hex')} is prepared for current epoch`, () => __awaiter(this, void 0, void 0, function* () {
                const validators = yield this.kit.contracts.getValidators();
                const currentEpoch = yield validators.getEpochNumber();
                return record.preparedEpoch.eq(currentEpoch);
            }))
                .addCheck(`Hotfix 0x${hash.toString('hex')} is approved`, () => record.approved)
                .runChecks();
            yield cli_1.displaySendTx('executeHotfixTx', governance.executeHotfix(hotfix, saltBuff), {}, 'HotfixExecuted');
        });
    }
}
exports.default = ExecuteHotfix;
ExecuteHotfix.description = 'Execute a governance hotfix prepared for the current epoch';
ExecuteHotfix.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: "Executors's address" }), jsonTransactions: command_1.flags.string({ required: true, description: 'Path to json transactions' }), salt: command_1.flags.string({ required: true, description: 'Secret salt associated with hotfix' }) });
ExecuteHotfix.examples = [
    'executehotfix --jsonTransactions ./transactions.json --salt 0x614dccb5ac13cba47c2430bdee7829bb8c8f3603a8ace22e7680d317b39e3658 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631',
];
//# sourceMappingURL=executehotfix.js.map