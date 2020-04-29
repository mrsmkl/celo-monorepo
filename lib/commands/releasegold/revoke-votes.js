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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
const release_gold_1 = require("./release-gold");
class RevokeVotes extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(RevokeVotes);
            const isRevoked = yield this.releaseGoldWrapper.isRevoked();
            const beneficiary = yield this.releaseGoldWrapper.getBeneficiary();
            const releaseOwner = yield this.releaseGoldWrapper.getReleaseOwner();
            const votes = new bignumber_js_1.default(flags.votes);
            yield checks_1.newCheckBuilder(this)
                .isAccount(this.releaseGoldWrapper.address)
                .isValidatorGroup(flags.group)
                .runChecks();
            this.kit.defaultAccount = isRevoked ? releaseOwner : beneficiary;
            const txos = yield this.releaseGoldWrapper.revoke(this.releaseGoldWrapper.address, flags.group, votes);
            for (const txo of txos) {
                yield cli_1.displaySendTx('revoke', txo);
            }
        });
    }
}
exports.default = RevokeVotes;
RevokeVotes.description = "Revokes `votes` for the given contract's account from the given group's account";
RevokeVotes.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { group: command_2.Flags.address({
        required: true,
        description: 'Address of the group to revoke votes from',
    }), votes: command_1.flags.string({ required: true, description: 'The number of votes to revoke' }) });
RevokeVotes.examples = [
    'revoke-votes --contract 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --group 0x5409ED021D9299bf6814279A6A1411A7e866A631 --votes 100',
];
//# sourceMappingURL=revoke-votes.js.map