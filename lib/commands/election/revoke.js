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
class ElectionRevoke extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ElectionRevoke);
            this.kit.defaultAccount = res.flags.from;
            yield checks_1.newCheckBuilder(this, res.flags.from)
                .isSignerOrAccount()
                .isValidatorGroup(res.flags.for)
                .runChecks();
            const election = yield this.kit.contracts.getElection();
            const accounts = yield this.kit.contracts.getAccounts();
            const account = yield accounts.voteSignerToAccount(res.flags.from);
            const txos = yield election.revoke(account, res.flags.for, new bignumber_js_1.default(res.flags.value));
            for (const txo of txos) {
                yield cli_1.displaySendTx('revoke', txo, { from: res.flags.from });
            }
        });
    }
}
exports.default = ElectionRevoke;
ElectionRevoke.description = 'Revoke votes for a Validator Group in validator elections.';
ElectionRevoke.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { from: command_2.Flags.address({ required: true, description: "Voter's address" }), for: command_2.Flags.address({
        description: "ValidatorGroup's address",
        required: true,
    }), value: command_1.flags.string({ description: 'Value of votes to revoke', required: true }) });
ElectionRevoke.examples = [
    'revoke --from 0x4443d0349e8b3075cba511a0a87796597602a0f1 --for 0x932fee04521f5fcb21949041bf161917da3f588b, --value 1000000',
];
//# sourceMappingURL=revoke.js.map