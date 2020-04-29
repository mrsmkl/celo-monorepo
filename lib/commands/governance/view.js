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
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
class View extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(View);
            const id = res.flags.proposalID;
            const raw = res.flags.raw;
            yield checks_1.newCheckBuilder(this)
                .proposalExists(id)
                .runChecks();
            const governance = yield this.kit.contracts.getGovernance();
            const record = yield governance.getProposalRecord(id);
            if (!raw) {
                try {
                    const jsonproposal = yield proposals_1.proposalToJSON(this.kit, record.proposal);
                    record.proposal = jsonproposal;
                }
                catch (error) {
                    console.warn(`Could not decode proposal, displaying raw data: ${error}`);
                }
            }
            // Identify the transaction with the highest constitutional requirement.
            const proposal = yield governance.getProposal(id);
            // Get the minimum participation and agreement required to pass a proposal.
            const participationParams = yield governance.getParticipationParameters();
            const constitution = yield governance.getConstitution(proposal);
            cli_1.printValueMapRecursive(Object.assign(Object.assign({}, record), { requirements: {
                    participation: participationParams.baseline,
                    agreement: constitution.times(100).toString() + '%',
                }, isApproved: yield governance.isApproved(id), isProposalPassing: yield governance.isProposalPassing(id), secondsUntilStages: yield governance.timeUntilStages(id) }));
        });
    }
}
exports.default = View;
View.description = 'View governance proposal information from ID';
View.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { proposalID: command_1.flags.string({ required: true, description: 'UUID of proposal to view' }), raw: command_1.flags.boolean({ required: false, description: 'Display proposal in raw bytes format' }) });
View.examples = ['view --proposalID 99', 'view --proposalID 99 --raw'];
//# sourceMappingURL=view.js.map