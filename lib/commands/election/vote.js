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
const base_1 = require("../../base");
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
class ElectionVote extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ElectionVote);
            const value = new bignumber_js_1.default(res.flags.value);
            this.kit.defaultAccount = res.flags.from;
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .isValidatorGroup(res.flags.for)
                .hasEnoughNonvotingLockedGold(value)
                .runChecks();
            const election = yield this.kit.contracts.getElection();
            const tx = yield election.vote(res.flags.for, value);
            yield cli_1.displaySendTx('vote', tx);
        });
    }
}
exports.default = ElectionVote;
ElectionVote.description = 'Vote for a Validator Group in validator elections.';
ElectionVote.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: "Voter's address" }), for: command_2.Flags.address({
        description: "ValidatorGroup's address",
        required: true,
    }), value: command_1.flags.string({ description: 'Amount of Gold used to vote for group', required: true }) });
ElectionVote.examples = [
    'vote --from 0x4443d0349e8b3075cba511a0a87796597602a0f1 --for 0x932fee04521f5fcb21949041bf161917da3f588b, --value 1000000',
];
//# sourceMappingURL=vote.js.map