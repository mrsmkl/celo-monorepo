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
class Approve extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Approve);
            const account = res.flags.from;
            const useMultiSig = res.flags.useMultiSig;
            const id = res.flags.proposalID;
            this.kit.defaultAccount = account;
            const governance = yield this.kit.contracts.getGovernance();
            const multiSigAddress = useMultiSig ? yield governance.getApprover() : '';
            const governanceApproverMultiSig = useMultiSig
                ? yield this.kit.contracts.getMultiSig(multiSigAddress)
                : undefined;
            const approver = useMultiSig ? multiSigAddress : account;
            // in case target is queued
            if (yield governance.isQueued(id)) {
                yield governance.dequeueProposalsIfReady().sendAndWaitForReceipt();
            }
            yield checks_1.newCheckBuilder(this)
                .isApprover(approver)
                .addConditionalCheck(`${account} is multisig signatory`, useMultiSig, () => __awaiter(this, void 0, void 0, function* () {
                return governanceApproverMultiSig !== undefined
                    ? governanceApproverMultiSig.isowner(account)
                    : new Promise(() => false);
            }))
                .proposalExists(id)
                .addCheck(`${id} not already approved`, () => __awaiter(this, void 0, void 0, function* () { return !(yield governance.isApproved(id)); }))
                .proposalInStage(id, 'Approval')
                .runChecks();
            const governanceTx = yield governance.approve(id);
            const tx = governanceApproverMultiSig === undefined
                ? governanceTx
                : yield governanceApproverMultiSig.submitOrConfirmTransaction(governance.address, governanceTx.txo);
            yield cli_1.displaySendTx('approveTx', tx, {}, 'ProposalApproved');
        });
    }
}
exports.default = Approve;
Approve.description = 'Approve a dequeued governance proposal';
// Only authorized approvers need to know about this command.
Approve.hidden = true;
Approve.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { proposalID: command_1.flags.string({ required: true, description: 'UUID of proposal to approve' }), from: command_2.Flags.address({ required: true, description: "Approver's address" }), useMultiSig: command_1.flags.boolean({
        description: 'True means the request will be sent through multisig.',
    }) });
Approve.examples = [
    'approve --proposalID 99 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631',
    'approve --proposalID 99 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631 --useMultiSig',
];
//# sourceMappingURL=approve.js.map