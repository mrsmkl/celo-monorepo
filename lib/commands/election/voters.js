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
const command_2 = require("../../utils/command");
function normalizeAddress(a) {
    try {
        a = a.toLowerCase();
        if (a.substr(0, 2) === '0x')
            return a.substr(2);
        else
            return a;
    }
    catch (_err) {
        return a;
    }
}
function num(str) {
    return new bignumber_js_1.default(str).shiftedBy(-18).toString(10);
}
function dedup(lst) {
    return [...new Set(lst)];
}
function put(obj, key, elem) {
    const lst = obj[key] || [];
    lst.push(elem);
    obj[key] = lst;
}
function elections(kit, blockNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const election = yield kit._web3Contracts.getElection();
        const validators = yield kit._web3Contracts.getValidators();
        const groups = yield election.methods
            .getEligibleValidatorGroups()
            // @ts-ignore
            .call({}, blockNumber);
        const elected = [];
        for (const el of groups) {
            // @ts-ignore
            const group = yield validators.methods.getValidatorGroup(el).call({}, blockNumber);
            group.members = group[0];
            // @ts-ignore
            const rawVotes = yield election.methods.getTotalVotesForGroup(el).call({}, blockNumber);
            const votes = new bignumber_js_1.default(rawVotes).shiftedBy(-18).toNumber();
            for (let i = 0; i < group.members.length; i++) {
                const member = group.members[i];
                elected.push({
                    address: normalizeAddress(member),
                    votes: Math.round(votes / (i + 1)),
                    affiliation: el,
                });
            }
        }
        return elected.sort((a, b) => b.votes - a.votes);
    });
}
class Voters extends base_1.BaseCommand {
    run() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(Voters);
            const kit = this.kit;
            const election = yield kit._web3Contracts.getElection();
            const accounts = yield kit._web3Contracts.getAccounts();
            const validators = yield kit._web3Contracts.getValidators();
            const evs = yield election.getPastEvents('ValidatorGroupVoteCast', { fromBlock: 0 });
            const voters = dedup(evs.map((a) => a.returnValues.account)).map(normalizeAddress);
            const filter = normalizeAddress(res.flags.group || '');
            if (res.flags.debug) {
                console.log('Events', evs.length);
                evs.forEach((a) => {
                    const b = a.returnValues;
                    console.log('At', a.blockNumber, 'account', b.account, 'group', b.group, b.value);
                });
                console.log('Voters', voters.length);
            }
            let fromBlock = (_a = res.flags['from-block'], (_a !== null && _a !== void 0 ? _a : (yield this.web3.eth.getBlock('latest')).number));
            let toBlock = (_b = res.flags['to-block'], (_b !== null && _b !== void 0 ? _b : (yield this.web3.eth.getBlock('latest')).number));
            if (res.flags['at-block']) {
                fromBlock = res.flags['at-block'];
                toBlock = res.flags['at-block'];
            }
            for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber += 720) {
                // @ts-ignore
                const lst = yield election.methods.getEligibleValidatorGroups().call({}, blockNumber);
                console.log('At block', blockNumber, 'groups', lst.length);
                const groupVoters = {};
                for (const voter of voters) {
                    const groups = 
                    // @ts-ignore
                    (yield election.methods.getGroupsVotedForByAccount(voter).call({}, blockNumber)).map(normalizeAddress);
                    groups.forEach((g) => put(groupVoters, g, voter));
                }
                const entries = Object.entries(groupVoters);
                const eResults = yield elections(this.kit, blockNumber);
                const nth = (idx) => __awaiter(this, void 0, void 0, function* () {
                    if (idx >= eResults.length)
                        return;
                    const member = eResults[idx].address;
                    const vName = yield accounts.methods.getName(member).call();
                    return `${idx}. Votes ${eResults[idx].votes} ${vName}@${member}`;
                });
                for (const [g, gVoters] of entries) {
                    if (filter && normalizeAddress(g) !== filter) {
                        continue;
                    }
                    // @ts-ignore
                    const group = yield validators.methods.getValidatorGroup(g).call({}, blockNumber);
                    group.members = group[0];
                    const gName = yield accounts.methods.getName(g).call();
                    console.log('Group', g, gName, 'at block', blockNumber, 'Voters:');
                    for (const voter of gVoters) {
                        const vName = yield accounts.methods.getName(voter).call();
                        const votes = yield election.methods
                            .getTotalVotesForGroupByAccount(g, voter)
                            // @ts-ignore
                            .call({}, blockNumber);
                        console.log(`    ${num(votes)} from ${vName}@${voter}`);
                    }
                    console.log('Group', g, gName, 'at block', blockNumber, 'Members:');
                    for (const member of group.members) {
                        const idx = eResults.findIndex((a) => normalizeAddress(member) === a.address);
                        const vName = yield accounts.methods.getName(member).call();
                        console.log(`    ${idx}. Votes ${eResults[idx].votes} ${vName}@${member}`);
                    }
                }
                console.log(yield nth(100));
                console.log(yield nth(101));
            }
        });
    }
}
exports.default = Voters;
Voters.description = 'Returns information about who has voted for groups.';
Voters.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { 'from-block': command_1.flags.integer({
        description: 'first block for which to get info',
    }), 'to-block': command_1.flags.integer({
        description: 'last block for which to get info',
    }), 'at-block': command_1.flags.integer({
        description: 'block for which to get info',
    }), group: command_2.Flags.address({ description: 'Group to inspect' }), debug: command_1.flags.boolean({ description: 'Toggle verbose output' }) });
//# sourceMappingURL=voters.js.map