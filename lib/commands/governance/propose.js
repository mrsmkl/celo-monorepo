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
const command_1 = require("@oclif/command");
const bignumber_js_1 = require("bignumber.js");
const fs_1 = require("fs");
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class Propose extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Propose);
            const account = res.flags.from;
            const deposit = new bignumber_js_1.BigNumber(res.flags.deposit);
            this.kit.defaultAccount = account;
            yield checks_1.newCheckBuilder(this, account)
                .hasEnoughGold(account, deposit)
                .exceedsProposalMinDeposit(deposit)
                .runChecks();
            const builder = new proposals_1.ProposalBuilder(this.kit);
            // BUILD FROM JSON
            const jsonString = fs_1.readFileSync(res.flags.jsonTransactions).toString();
            const jsonTransactions = JSON.parse(jsonString);
            jsonTransactions.forEach((tx) => builder.addJsonTx(tx));
            // BUILD FROM CONTRACTKIT FUNCTIONS
            // const params = await this.kit.contracts.getBlockchainParameters()
            // builder.addTx(params.setMinimumClientVersion(1, 8, 24), { to: params.address })
            // builder.addWeb3Tx()
            // builder.addProxyRepointingTx
            const proposal = yield builder.build();
            cli_1.printValueMapRecursive(proposals_1.proposalToJSON(this.kit, proposal));
            const governance = yield this.kit.contracts.getGovernance();
            yield cli_1.displaySendTx('proposeTx', governance.propose(proposal, res.flags.descriptionURL), { value: res.flags.deposit }, 'ProposalQueued');
        });
    }
}
exports.default = Propose;
Propose.description = 'Submit a governance proposal';
Propose.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { jsonTransactions: command_1.flags.string({ required: true, description: 'Path to json transactions' }), deposit: command_1.flags.string({ required: true, description: 'Amount of Gold to attach to proposal' }), from: command_2.Flags.address({ required: true, description: "Proposer's address" }), descriptionURL: command_1.flags.string({
        required: true,
        description: 'A URL where further information about the proposal can be viewed',
    }) });
Propose.examples = [
    'propose --jsonTransactions ./transactions.json --deposit 10000 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631 --descriptionURL https://gist.github.com/yorhodes/46430eacb8ed2f73f7bf79bef9d58a33',
];
//# sourceMappingURL=propose.js.map