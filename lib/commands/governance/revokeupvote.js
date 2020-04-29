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
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_1 = require("../../utils/command");
class RevokeUpvote extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(RevokeUpvote);
            const signer = res.flags.from;
            this.kit.defaultAccount = signer;
            yield checks_1.newCheckBuilder(this, signer)
                .isVoteSignerOrAccount()
                .runChecks();
            // TODO(nategraf): Check whether there are upvotes to revoke before sending transaction.
            const governance = yield this.kit.contracts.getGovernance();
            const account = yield (yield this.kit.contracts.getAccounts()).voteSignerToAccount(signer);
            yield cli_1.displaySendTx('revokeUpvoteTx', yield governance.revokeUpvote(account), {}, 'ProposalUpvoteRevoked');
        });
    }
}
exports.default = RevokeUpvote;
RevokeUpvote.description = 'Revoke upvotes for queued governance proposals';
RevokeUpvote.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_1.Flags.address({ required: true, description: "Upvoter's address" }) });
RevokeUpvote.examples = ['revokeupvote --from 0x5409ed021d9299bf6814279a6a1411a7e866a631'];
//# sourceMappingURL=revokeupvote.js.map