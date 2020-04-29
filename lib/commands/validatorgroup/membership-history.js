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
class MembershipHistory extends base_1.BaseCommand {
    run() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.parse(MembershipHistory);
            const kit = this.kit;
            const election = yield kit._web3Contracts.getElection();
            const accounts = yield kit._web3Contracts.getAccounts();
            const validators = yield kit._web3Contracts.getValidators();
            const filter = normalizeAddress(res.flags.group || '');
            let fromBlock = (_a = res.flags['from-block'], (_a !== null && _a !== void 0 ? _a : (yield this.web3.eth.getBlock('latest')).number));
            let toBlock = (_b = res.flags['to-block'], (_b !== null && _b !== void 0 ? _b : (yield this.web3.eth.getBlock('latest')).number));
            if (res.flags['at-block']) {
                fromBlock = res.flags['at-block'];
                toBlock = res.flags['at-block'];
            }
            const groups = {};
            for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber += 720) {
                // @ts-ignore
                const lst = yield election.methods.getEligibleValidatorGroups().call({}, blockNumber);
                for (const g of lst) {
                    if (filter && normalizeAddress(g) !== filter) {
                        continue;
                    }
                    // @ts-ignore
                    const group = yield validators.methods.getValidatorGroup(g).call({}, blockNumber);
                    group.members = group[0];
                    if (!groups[normalizeAddress(g)]) {
                        groups[normalizeAddress(g)] = { epochs: 0, members: {} };
                    }
                    const gInfo = groups[normalizeAddress(g)];
                    gInfo.epochs++;
                    for (const member of group.members) {
                        gInfo.members[normalizeAddress(member)] = (gInfo.members[normalizeAddress(member)] || 0) + 1;
                    }
                }
            }
            const entries = Object.entries(groups);
            for (const [g, info] of entries) {
                console.log(`Group ${yield accounts.methods.getName(g).call()}@${g} eligible for ${info.epochs} epochs`);
                const entries2 = Object.entries(info.members);
                for (const [v, epochs] of entries2) {
                    console.log(`   ${yield accounts.methods.getName(v).call()}@${v} was member for ${epochs} epochs (${Math.round(100 * epochs / info.epochs)}%)`);
                }
            }
        });
    }
}
exports.default = MembershipHistory;
MembershipHistory.description = 'Returns information about historical members of groups.';
MembershipHistory.flags = Object.assign(Object.assign({}, base_1.BaseCommand.flags), { 'from-block': command_1.flags.integer({
        description: 'first block for which to get info',
    }), 'to-block': command_1.flags.integer({
        description: 'last block for which to get info',
    }), 'at-block': command_1.flags.integer({
        description: 'block for which to get info',
    }), group: command_2.Flags.address({ description: 'Group to inspect' }), debug: command_1.flags.boolean({ description: 'Toggle verbose output' }) });
//# sourceMappingURL=membership-history.js.map