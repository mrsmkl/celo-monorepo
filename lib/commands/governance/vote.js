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
const command_1 = require("@oclif/command");
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class Vote extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Vote);
            const signer = res.flags.from;
            const id = res.flags.proposalID;
            const voteValue = res.flags.value;
            this.kit.defaultAccount = signer;
            const governance = yield this.kit.contracts.getGovernance();
            yield checks_1.newCheckBuilder(this, signer)
                .isVoteSignerOrAccount()
                .proposalExists(id)
                .proposalInStage(id, 'Referendum')
                .runChecks();
            yield cli_1.displaySendTx('voteTx', yield governance.vote(id, voteValue), {}, 'ProposalVoted');
        });
    }
}
exports.default = Vote;
Vote.description = 'Vote on an approved governance proposal';
Vote.voteOptions = ['Abstain', 'No', 'Yes'];
Vote.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { proposalID: command_1.flags.string({ required: true, description: 'UUID of proposal to vote on' }), value: command_1.flags.enum({ options: Vote.voteOptions, required: true, description: 'Vote' }), from: command_2.Flags.address({ required: true, description: "Voter's address" }) });
Vote.examples = [
    'vote --proposalID 99 --value Yes --from 0x5409ed021d9299bf6814279a6a1411a7e866a631',
];
//# sourceMappingURL=vote.js.map