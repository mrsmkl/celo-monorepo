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
const async_1 = require("@celo/utils/lib/async");
const command_1 = require("@oclif/command");
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ElectionVote extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ElectionVote);
            this.kit.defaultAccount = res.flags.from;
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .runChecks();
            const election = yield this.kit.contracts.getElection();
            const accounts = yield this.kit.contracts.getAccounts();
            const account = yield accounts.voteSignerToAccount(res.flags.from);
            const hasPendingVotes = yield election.hasPendingVotes(account);
            if (hasPendingVotes) {
                if (res.flags.wait) {
                    // Spin until pending votes become activatable.
                    cli_ux_1.cli.action.start(`Waiting until pending votes can be activated`);
                    while (!(yield election.hasActivatablePendingVotes(account))) {
                        yield async_1.sleep(1000);
                    }
                    cli_ux_1.cli.action.stop();
                }
                const txos = yield election.activate(account);
                for (const txo of txos) {
                    yield cli_1.displaySendTx('activate', txo, { from: res.flags.from });
                }
                if (txos.length === 0) {
                    this.log(`Pending votes not yet activatable. Consider using the --wait flag.`);
                }
            }
            else {
                this.log(`No pending votes to activate`);
            }
        });
    }
}
exports.default = ElectionVote;
ElectionVote.description = 'Activate pending votes in validator elections to begin earning rewards. To earn rewards as a voter, it is required to activate your pending votes at some point after the end of the epoch in which they were made.';
ElectionVote.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: "Voter's address" }), wait: command_1.flags.boolean({ description: 'Wait until all pending votes can be activated' }) });
ElectionVote.examples = [
    'activate --from 0x4443d0349e8b3075cba511a0a87796597602a0f1',
    'activate --from 0x4443d0349e8b3075cba511a0a87796597602a0f1 --wait',
];
//# sourceMappingURL=activate.js.map