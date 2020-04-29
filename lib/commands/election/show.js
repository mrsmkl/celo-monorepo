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
class ElectionShow extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(ElectionShow);
            const address = res.args.address;
            const election = yield this.kit.contracts.getElection();
            if (res.flags.group) {
                yield checks_1.newCheckBuilder(this)
                    .isValidatorGroup(address)
                    .runChecks();
                const groupVotes = yield election.getValidatorGroupVotes(address);
                cli_1.printValueMapRecursive(groupVotes);
            }
            else if (res.flags.voter) {
                yield checks_1.newCheckBuilder(this)
                    .isAccount(address)
                    .runChecks();
                const voter = yield election.getVoter(address);
                cli_1.printValueMapRecursive(voter);
            }
            else {
                throw Error('Must select --voter or --group');
            }
        });
    }
}
exports.default = ElectionShow;
ElectionShow.description = 'Show election information about a voter or registered Validator Group';
ElectionShow.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses()), { voter: command_1.flags.boolean({
        exclusive: ['group'],
        description: 'Show information about an account voting in Validator elections',
    }), group: command_1.flags.boolean({
        exclusive: ['voter'],
        description: 'Show information about a group running in Validator elections',
    }) });
ElectionShow.args = [
    command_2.Args.address('address', { description: "Voter or Validator Groups's address" }),
];
ElectionShow.examples = [
    'show 0x97f7333c51897469E8D98E7af8653aAb468050a3 --voter',
    'show 0x97f7333c51897469E8D98E7af8653aAb468050a3 --group',
];
//# sourceMappingURL=show.js.map