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
const chalk_1 = __importDefault(require("chalk"));
const cli_ux_1 = require("cli-ux");
const base_1 = require("../../base");
exports.table = {
    index: {},
    votes: {},
    score: {},
    name: {},
    address: {},
    groupName: {},
    affiliation: {},
};
class ElectionCompare extends base_1.BaseCommand {
    run() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            cli_ux_1.cli.action.start('Running mock election');
            const res = this.parse(ElectionCompare);
            const accounts = yield this.kit._web3Contracts.getAccounts();
            const election = yield this.kit._web3Contracts.getElection();
            const validators = yield this.kit._web3Contracts.getValidators();
            const blockNumber = (_a = res.flags['at-block'], (_a !== null && _a !== void 0 ? _a : (yield this.web3.eth.getBlock('latest')).number));
            const groups = yield election.methods
                .getEligibleValidatorGroups()
                // @ts-ignore
                .call({}, blockNumber);
            const elected = [];
            for (const el of groups) {
                // @ts-ignore
                const group = yield validators.methods.getValidatorGroup(el).call({}, blockNumber);
                group.members = group[0];
                const groupName = yield accounts.methods.getName(el).call();
                // @ts-ignore
                const rawVotes = yield election.methods.getTotalVotesForGroup(el).call({}, blockNumber);
                const votes = new bignumber_js_1.default(rawVotes).shiftedBy(-18).toNumber();
                for (let i = 0; i < group.members.length; i++) {
                    const member = group.members[i];
                    const name = yield accounts.methods.getName(member).call();
                    const score = '???';
                    //          (await validators.getValidator(member)).score.multipliedBy(100).toFixed(1) + '%'
                    elected.push({
                        address: member,
                        name,
                        votes: Math.round(votes / (i + 1)),
                        affiliation: el,
                        groupName,
                        score,
                    });
                }
            }
            cli_ux_1.cli.action.stop();
            const sorted = elected.sort((a, b) => b.votes - a.votes);
            cli_ux_1.cli.table(sorted.map((a, i) => (Object.assign(Object.assign({}, a), { index: i < 100 ? i + 1 : chalk_1.default.gray((i + 1).toString()) }))), exports.table);
        });
    }
}
exports.default = ElectionCompare;
ElectionCompare.description = 'Runs a "mock" election and prints out the validators that would be elected if the epoch ended right now.';
ElectionCompare.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { 'at-block': command_1.flags.integer({
        description: 'block for which to run elections',
    }) });
//# sourceMappingURL=compare.js.map