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
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
class List extends base_1.BaseCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(List);
            cli_ux_1.cli.action.start('Fetching validator group vote totals');
            const election = yield this.kit.contracts.getElection();
            const groupVotes = yield election.getValidatorGroupsVotes();
            cli_ux_1.cli.action.stop();
            cli_ux_1.cli.table(groupVotes, {
                address: {},
                name: {},
                votes: { get: (g) => g.votes.toFixed() },
                capacity: { get: (g) => g.capacity.toFixed() },
                eligible: {},
            }, { 'no-truncate': !res.flags.truncate });
        });
    }
}
exports.default = List;
List.description = 'Prints the list of validator groups, the number of votes they have received, the number of additional votes they are able to receive, and whether or not they are eligible to elect validators.';
List.flags = Object.assign({}, base_1.BaseCommand.flagsWithoutLocalAddresses());
List.examples = ['list'];
//# sourceMappingURL=list.js.map